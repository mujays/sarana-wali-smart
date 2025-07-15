pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        BRANCH_TO_BUILD = 'dev'
        DEPLOY_DIR = '/var/www/fe-wali-smart-dev'
        HOST = '3.0.3.215'
    }
    stages {
        stage('Pre-Deploy Check') {
            steps {
                slackSend(
                    channel: '#info-server',
                    color: '#439FE0',
                    message: "🟡 *Pre-deploy check started* for branch *${BRANCH_TO_BUILD}*"
                )

                sshagent(credentials: ['server-fe-levera']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@$HOST '
                        echo "📦 Checking $DEPLOY_DIR" &&
                        if [ -d $DEPLOY_DIR ]; then
                            echo "✅ Directory exists"
                        else
                            echo "ℹ️ Directory not found. Will be created during clone."
                        fi

                        echo "🔍 Docker status:"
                        docker ps || echo "Docker not running"
                    '
                    """
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(credentials: ['server-fe-levera']) {
                    withCredentials([
                        usernamePassword(credentialsId: 'github-token', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PAT'),
                        file(credentialsId: 'fe-dev-smart-wali', variable: 'ENVFILE')
                    ]) {
                        sh """
                        ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@$HOST '
                            if [ ! -d $DEPLOY_DIR/.git ]; then
                                echo "📥 Cloning fresh repo... "
                                rm -rf $DEPLOY_DIR &&
                                git clone -b $BRANCH_TO_BUILD https://$GIT_USER:$GIT_PAT@github.com/SaranaTechnology/FE-wali-smartschool.git $DEPLOY_DIR
                            else
                                echo "🔄 Pulling latest code..."
                                cd $DEPLOY_DIR &&
                                git checkout $BRANCH_TO_BUILD &&
                                git fetch &&
                                git reset --hard &&
                                git pull
                            fi
                        '

                        echo "📤 Uploading .env..."
                        scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $ENVFILE root@$HOST:\$DEPLOY_DIR/.env

                        echo "🚀 Running Docker Compose..."
                        ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@$HOST '
                            cd $DEPLOY_DIR &&
                            docker compose down || true &&
                            docker compose build &&
                            docker compose up -d &&
                            docker image prune -f &&
                            docker builder prune -f
                        '
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            slackSend(
                channel: '#info-server',
                color: 'good',
                message: "✅ *FE Wali Smart DEV deployed successfully* to *${HOST}*"
            )
        }

        failure {
            slackSend(
                channel: '#info-server',
                color: 'danger',
                message: "❌ *FE Wali Smart DEV deployment failed* on *${HOST}*"
            )
        }
    }
}

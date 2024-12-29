import AppBreadcrumbs from "@/components/common/app-breadcrums";

function SiswaPage() {
  return (
    <div className="p-4">
      <div className="space-y-2">
        <AppBreadcrumbs
          items={[
            {
              title: "Home",
              url: "/",
            },
            {
              title: "Siswa",
              url: "#",
            },
          ]}
        />
        <p className="text-xl font-medium">Data Siswa</p>
      </div>
    </div>
  );
}

export default SiswaPage;

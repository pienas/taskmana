import DragDrop from "@components/DragDrop";
import NavBar from "@components/NavBar";
import { AppShell } from "@mantine/core";
import { NextPage } from "next";
import { useRouter } from "next/router";

const ProjectPage: NextPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  return (
    <AppShell navbar={<NavBar />} style={{ overflow: "hidden" }}>
      <DragDrop projectId={projectId} />
    </AppShell>
  );
};

export default ProjectPage;

import Brand from "@components/Brand";
import DragDrop from "@components/DragDrop";
import Projects from "@components/Projects";
import User from "@components/User";
import { AppShell, Navbar } from "@mantine/core";
import { useRouter } from "next/router";

const NavBar = () => {
  return (
    <Navbar width={{ base: 300 }} p="xs" fixed>
      <Navbar.Section mt="xs">
        <Brand />
      </Navbar.Section>
      <Navbar.Section grow mt="md">
        <Projects />
      </Navbar.Section>
      <Navbar.Section>
        <User />
      </Navbar.Section>
    </Navbar>
  );
};

const ProjectPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  return (
    <AppShell navbar={<NavBar />} style={{ overflow: "hidden" }}>
      <DragDrop projectId={projectId} />
    </AppShell>
  );
};

export default ProjectPage;

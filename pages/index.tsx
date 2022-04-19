import Brand from "@components/Brand";
import DragDrop from "@components/DragDrop";
import Projects from "@components/Projects";
import User from "@components/User";
import { AppShell, Navbar, Text } from "@mantine/core";
import type { NextPage } from "next";

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

const Home: NextPage = () => {
  return (
    <AppShell navbar={<NavBar />} style={{ overflow: "hidden" }}>
      <Text pl={300}>Select a project to view tasks</Text>
    </AppShell>
  );
};

export default Home;

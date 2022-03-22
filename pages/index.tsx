import Brand from "@components/Brand";
import DragDrop from "@components/DragDrop";
import Links from "@components/Links";
import User from "@components/User";
import { AppShell, Navbar } from "@mantine/core";
import type { NextPage } from "next";

const NavBar = () => {
  return (
    <Navbar width={{ base: 300 }} p="xs">
      <Navbar.Section mt="xs">
        <Brand />
      </Navbar.Section>
      <Navbar.Section grow mt="md">
        <Links />
      </Navbar.Section>
      <Navbar.Section>
        <User />
      </Navbar.Section>
    </Navbar>
  );
};

const Home: NextPage = () => {
  return (
    <AppShell navbar={<NavBar />}>
      <DragDrop />
    </AppShell>
  );
};

export default Home;

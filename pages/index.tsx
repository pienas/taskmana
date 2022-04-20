import NavBar from "@components/NavBar";
import { AppShell, Text } from "@mantine/core";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <AppShell navbar={<NavBar />} style={{ overflow: "hidden" }}>
      <Text pl={300}>Select a project to view tasks</Text>
    </AppShell>
  );
};

export default Home;

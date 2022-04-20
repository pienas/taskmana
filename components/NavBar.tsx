import { Navbar } from "@mantine/core";
import Brand from "./Brand";
import Projects from "./Projects";
import User from "./User";

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

export default NavBar;

import Brand from "@components/Brand";
import DragDrop from "@components/DragDrop";
import Links from "@components/Links";
import User from "@components/User";
import { AppShell, Grid, Group, Navbar } from "@mantine/core";
import type { NextPage } from "next";
import { uuid } from "uuidv4";
import { firestore } from "@firebase/clientApp";

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
      <Grid>
        <Grid.Col span={3}>
          <Group direction="column" position="center" spacing={0}>
            <DragDrop
              data={[
                {
                  id: uuid(),
                  name: "New task",
                  description:
                    "Add ability for service owners to invite employees to join their service with a custom generated one-time link with expiration date or if employee has their user already created just to invite them",
                  createdAt: Date.now(),
                },
                {
                  id: uuid(),
                  name: "New task2",
                  description:
                    "Add ability for service owners to invite employees to join their service with a custom generated one-time link with expiration date or if employee has their user already created just to invite them",
                  createdAt: Date.now(),
                },
              ]}
            />
          </Group>
        </Grid.Col>
        <Grid.Col span={3}>
          <DragDrop
            data={[
              {
                id: uuid(),
                name: "New task",
                description:
                  "Add ability for service owners to invite employees to join their service with a custom generated one-time link with expiration date or if employee has their user already created just to invite them",
                createdAt: Date.now(),
              },
              {
                id: uuid(),
                name: "New task2",
                description:
                  "Add ability for service owners to invite employees to join their service with a custom generated one-time link with expiration date or if employee has their user already created just to invite them",
                createdAt: Date.now(),
              },
            ]}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <DragDrop
            data={[
              {
                id: uuid(),
                name: "New task",
                description:
                  "Add ability for service owners to invite employees to join their service with a custom generated one-time link with expiration date or if employee has their user already created just to invite them",
                createdAt: Date.now(),
              },
              {
                id: uuid(),
                name: "New task2",
                description:
                  "Add ability for service owners to invite employees to join their service with a custom generated one-time link with expiration date or if employee has their user already created just to invite them",
                createdAt: Date.now(),
              },
            ]}
          />
        </Grid.Col>
      </Grid>
    </AppShell>
  );
};

export default Home;

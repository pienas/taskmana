import React, { useState } from "react";
import {
  Box,
  Button,
  ColorInput,
  ColorSwatch,
  Group,
  Menu,
  Modal,
  Text,
  TextInput,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import Link from "next/link";
import { useRouter } from "next/router";
import { createProject, deleteProject } from "@lib/db";
import { useNotifications } from "@mantine/notifications";
import { Check, ExclamationMark, Trash } from "tabler-icons-react";
import { useAuth } from "./AuthProvider";

const Projects = () => {
  const { token, uid } = useAuth();
  const { data, error, mutate } = useSWR(
    uid ? ["/api/projects", token] : null,
    fetcher
  );
  const [opened, setOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [tempLabel, setTempLabel] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectColor, setProjectColor] = useState("");
  const notifications = useNotifications();
  const theme = useMantineTheme();
  const router = useRouter();
  if (error)
    return (
      <>
        Failed to load
        <div>{error}</div>
      </>
    );
  if (!data) return <>Loading...</>;
  const closeModal = () => {
    setOpened(false);
    setProjectName("");
    setProjectColor("");
  };
  const closeDeleteModal = () => {
    setDeleteOpened(false);
    setTempLabel("");
  };
  const projectCreate = async () => {
    if (!projectName.length)
      return notifications.showNotification({
        title: "No name",
        message: "Please enter a project name",
        color: "red",
        icon: <ExclamationMark />,
      });
    if (!projectColor.length)
      return notifications.showNotification({
        title: "No color",
        message: "Please select a project color",
        color: "red",
        icon: <ExclamationMark />,
      });
    await createProject(uid, projectName, projectColor);
    setOpened(false);
    setProjectName("");
    setProjectColor("");
    mutate();
    return notifications.showNotification({
      title: "Project created",
      message: "Your project was succesfully created",
      color: "green",
      icon: <Check />,
    });
  };
  const projectDelete = async (label: string) => {
    await deleteProject(label);
    router.replace("/");
    setDeleteOpened(false);
    setTempLabel("");
    mutate();
    return notifications.showNotification({
      title: "Column deleted",
      message: "Your column was succesfully deleted",
      color: "green",
      icon: <Check />,
    });
  };
  return (
    <>
      {data.map((project) => (
        <div key={project.label}>
          <Link href={`/${project.link}`} passHref>
            <UnstyledButton
              sx={() => ({
                display: "block",
                width: "100%",
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[0]
                    : theme.black,
                transition: "all .2s",
                backgroundColor:
                  router.query.projectId === project.link
                    ? theme.colorScheme === "dark"
                      ? theme.colors.dark[5]
                      : theme.colors.gray[0]
                    : "transparent",
                "&:hover": {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[6]
                      : theme.colors.gray[0],
                  color:
                    theme.colorScheme === "dark" ? theme.white : theme.black,
                },
              })}
              mb={8}
            >
              <Group position="apart">
                <Group>
                  <ColorSwatch color={project.color} radius="sm" size={12} />
                  <Text size="sm">{project.label}</Text>
                </Group>
                <Menu>
                  <Menu.Item
                    color="red"
                    icon={<Trash size={14} />}
                    onClick={() => setDeleteOpened(true)}
                  >
                    Delete project
                  </Menu.Item>
                </Menu>
              </Group>
            </UnstyledButton>
          </Link>
          <Modal
            opened={deleteOpened}
            onClose={closeDeleteModal}
            withCloseButton={false}
            centered
            size="lg"
            sx={{
              ".mantine-Modal-modal": {
                backgroundColor: theme.colors.red[3],
                padding: 0,
              },
            }}
          >
            <Text
              size="xl"
              weight={600}
              color={theme.colors.red[8]}
              mb={8}
              p={20}
              pb={0}
            >
              Delete this project?
            </Text>
            <Text
              size="sm"
              weight={500}
              color={theme.colors.red[8]}
              p={20}
              pt={0}
            >
              Doing so will permanently delete the data at this project,
              including all nested columns, tasks, subtasks and comments.
            </Text>
            <Box
              sx={{
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark
                    : theme.white,
                padding: 20,
                borderRadius: theme.radius.sm,
              }}
            >
              <Text color="dimmed" size="sm">
                Project name:
              </Text>
              <Text
                color={theme.colorScheme === "dark" ? theme.white : theme.black}
                weight={600}
                mb={8}
              >
                {project.label}
              </Text>
              <Text color="dimmed" size="sm" mb={8}>
                Confirm you want to delete this project by typing its name
                below:
              </Text>
              <TextInput
                placeholder={project.label}
                radius="md"
                size="md"
                variant="default"
                value={tempLabel}
                onChange={(e) => setTempLabel(e.currentTarget.value)}
                required
                mb={8}
              />
              <Group position="right" mt="md">
                <Button
                  variant="subtle"
                  color="gray"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </Button>
                <Button
                  color="red"
                  variant="light"
                  disabled={project.label !== tempLabel}
                  onClick={() => projectDelete(project.label)}
                  sx={{ transition: "all .4s" }}
                >
                  Delete
                </Button>
              </Group>
            </Box>
          </Modal>
        </div>
      ))}
      <UnstyledButton
        sx={(theme) => ({
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
          transition: "all .2s",
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
            color: theme.colorScheme === "dark" ? theme.white : theme.black,
          },
        })}
      >
        <Text
          size="sm"
          align="center"
          weight={600}
          onClick={() => setOpened(true)}
        >
          + Add project
        </Text>
      </UnstyledButton>
      <Modal
        opened={opened}
        onClose={closeModal}
        title="Add project"
        centered
        size="lg"
      >
        <TextInput
          placeholder="Enter project name"
          radius="md"
          size="md"
          variant="default"
          label="Project name"
          value={projectName}
          onChange={(e) => setProjectName(e.currentTarget.value)}
          required
          mb={8}
        />
        <ColorInput
          placeholder="Select color"
          radius="md"
          size="md"
          variant="default"
          label="Project color"
          value={projectColor}
          onChange={setProjectColor}
          required
        />
        <Group position="right" mt="md">
          <Button variant="subtle" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="light"
            onClick={projectCreate}
            sx={{ transition: "all .4s" }}
          >
            Create
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default Projects;

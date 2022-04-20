import { auth } from "@lib/firebase";
import {
  Avatar,
  Box,
  Group,
  Menu,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useRouter } from "next/router";
import { ChevronRight, Logout } from "tabler-icons-react";
import { useAuth } from "./AuthProvider";

const User = () => {
  const theme = useMantineTheme();
  const router = useRouter();
  const { displayName, email, photoURL } = useAuth();
  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
    >
      <Menu
        sx={{ width: "100%" }}
        position="right"
        placement="center"
        control={
          <UnstyledButton
            sx={{
              display: "block",
              width: "100%",
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[0]
                  : theme.black,

              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
              },
            }}
          >
            <Group>
              <Avatar src={photoURL} radius="xl" />
              <Box sx={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  {displayName}
                </Text>
                <Text color="dimmed" size="xs">
                  {email}
                </Text>
              </Box>
              <ChevronRight size={18} />
            </Group>
          </UnstyledButton>
        }
      >
        <Menu.Item
          icon={<Logout size={14} />}
          onClick={() => {
            router.replace("/");
            auth.signOut();
          }}
        >
          Logout
        </Menu.Item>
      </Menu>
    </Box>
  );
};

export default User;

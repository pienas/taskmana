import {
  Avatar,
  Box,
  Group,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { ChevronLeft, ChevronRight } from "tabler-icons-react";

const User = () => {
  const theme = useMantineTheme();
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
      <UnstyledButton
        sx={{
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        }}
      >
        <Group>
          <Avatar
            src="https://avatars.githubusercontent.com/u/46919012?v=4"
            radius="xl"
          />
          <Box sx={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              Karolis Urbaitis
            </Text>
            <Text color="dimmed" size="xs">
              urbaitiskarolis1@gmail.com
            </Text>
          </Box>
          <ChevronRight size={18} />
        </Group>
      </UnstyledButton>
    </Box>
  );
};

export default User;

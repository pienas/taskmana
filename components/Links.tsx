import React from "react";
import { Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { ListCheck } from "tabler-icons-react";

type LinkProps = {
  icon: React.ReactNode;
  color: string;
  label: string;
};

const Link = ({ icon, color, label }: LinkProps) => {

  return (
    <UnstyledButton
      sx={(theme) => ({
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
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
};

const linksData = [
  { icon: <ListCheck size={16} />, color: "blue", label: "My tasks" },
];

const Links = () => {
  return (
    <>
      {linksData.map((link) => (
        <Link {...link} key={link.label} />
      ))}
    </>
  );
};

export default Links;

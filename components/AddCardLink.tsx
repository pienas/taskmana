import { Button } from "@mantine/core";

const AddCardLink = ({ onClick }) => {
  return (
    <Button
      variant="subtle"
      color="dark"
      radius="md"
      onClick={onClick}
      styles={(theme) => ({
        root: {
          width: "300px",
          transition: "all .2s",
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.fn.darken(theme.colors.dark[5], 0.05)
                : theme.fn.lighten(theme.colors.gray[1], 0.05),
            color: theme.colorScheme === "dark" ? theme.white : theme.black,
          },
        },
      })}
    >
      + Add task
    </Button>
  );
};

export default AddCardLink;

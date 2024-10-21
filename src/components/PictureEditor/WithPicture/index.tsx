import { Box, Button, Icon } from "@chakra-ui/react";
import { MemeView, MemePictureProps } from "../../MemeView";
import { Pencil } from "@phosphor-icons/react";

type Props = { memePicture: MemePictureProps; open: () => void };

export const WithPicture = ({ memePicture, open }: Props) => {
  return (
    <Box
      width="full"
      height="full"
      position="relative"
      __css={{
        "&:hover .change-picture-button": {
          display: "inline-block",
        },
        "& .change-picture-button": {
          display: "none",
        },
      }}
    >
      <MemeView {...memePicture} />
      <Button
        className="change-picture-button"
        leftIcon={<Icon as={Pencil} boxSize={4} />}
        colorScheme="cyan"
        color="white"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        position="absolute"
        onClick={open}
      >
        Change picture
      </Button>
    </Box>
  );
};

import { useDropzone } from "react-dropzone";
import { MemePictureProps } from "../MemeView";
import { AspectRatio, Box, Flex, Icon, Text } from "@chakra-ui/react";
import { Image } from "@phosphor-icons/react";
import { WithPicture } from "./WithPicture";

type MemeEditorProps = {
  onDrop: (file: File) => void;
  memePicture?: MemePictureProps;
};

export const PictureEditor: React.FC<MemeEditorProps> = ({
  onDrop,
  memePicture,
}) => {
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: (files: File[]) => {
      if (files.length === 0) {
        return;
      }
      onDrop(files[0]);
    },
    noClick: memePicture !== undefined,
    accept: { "image/png": [".png"], "image/jpg": [".jpg"] },
  });

  return (
    <AspectRatio ratio={16 / 9}>
      <Box
        {...getRootProps()}
        width="full"
        position="relative"
        border={!memePicture ? "1px dashed" : undefined}
        borderColor="gray.300"
        borderRadius={9}
        px={1}
      >
        <input data-testid="picture-input" {...getInputProps()} />
        {memePicture ? (
          <WithPicture memePicture={memePicture} open={open} />
        ) : (
          <Flex
            flexDir="column"
            width="full"
            height="full"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={Image} color="black" boxSize={16} />
            <Text>Select a picture</Text>
            <Text color="gray.400" fontSize="sm">
              or drop it in this area
            </Text>
          </Flex>
        )}
      </Box>
    </AspectRatio>
  );
};

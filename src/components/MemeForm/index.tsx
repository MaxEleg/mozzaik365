import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { PictureEditor } from "../../components/PictureEditor";
import { Plus, Trash } from "@phosphor-icons/react";
import { MemeFormType } from "./types";
import { useHandleFormSubmit } from "./hooks";

export const MemeForm = () => {
  // hooks
  const formData = useForm<MemeFormType>();
  const { register, setValue, handleSubmit } = formData;
  const arrayFields = useFieldArray({
    control: formData.control,
    name: "texts",
  });
  const { fields, append, remove } = arrayFields;
  const picture = useWatch({ name: "picture", control: formData.control });
  // we need to watch the texts to be able to automatically update the meme captions
  // if we use fields we don't have any update when the captions changes
  const texts = useWatch({ name: "texts", control: formData.control });

  // handlers
  const handleDrop = (file: File) => {
    setValue("picture", {
      url: URL.createObjectURL(file),
      file,
    });
  };

  const handleAddCaptionButtonClick = () => {
    append({
      content: `New caption ${fields.length + 1}`,
      x: Math.random() * 400,
      y: Math.random() * 225,
    });
  };

  const handleDeleteCaptionButtonClick = (index: number) => remove(index);

  return (
    <form
      style={{ width: "100%" }}
      onSubmit={handleSubmit(useHandleFormSubmit())}
    >
      <input type="hidden" {...register("picture")} />
      <Flex width="full" height="full">
        <Box flexGrow={1} height="full" p={4} overflowY="auto">
          <VStack spacing={5} align="stretch">
            <Box>
              <Heading as="h2" size="md" mb={2}>
                Upload your picture
              </Heading>
              <PictureEditor
                onDrop={handleDrop}
                memePicture={
                  picture?.url
                    ? {
                        pictureUrl: picture.url,
                        texts: texts || [],
                      }
                    : undefined
                }
              />
            </Box>
            <Box>
              <Heading as="h2" size="md" mb={2}>
                Describe your meme
              </Heading>
              <Textarea
                {...register("description")}
                placeholder="Type your description here..."
              />
            </Box>
          </VStack>
        </Box>
        <Flex
          flexDir="column"
          width="30%"
          minW="250"
          height="full"
          boxShadow="lg"
        >
          <Heading as="h2" size="md" mb={2} p={4}>
            Add your captions
          </Heading>
          <Box p={4} flexGrow={1} height={0} overflowY="auto">
            <VStack>
              {fields.map((field, index) => (
                <Flex width="full" key={field.id}>
                  <Input
                    id={`texts.${index}.content`}
                    aria-label={`text ${index + 1}`}
                    {...register(`texts.${index}.content`)}
                    mr={1}
                  />
                  <IconButton
                    onClick={() => handleDeleteCaptionButtonClick(index)}
                    aria-label="Delete caption"
                    icon={<Icon as={Trash} />}
                  />
                </Flex>
              ))}
              <Button
                colorScheme="cyan"
                leftIcon={<Icon as={Plus} />}
                variant="ghost"
                size="sm"
                width="full"
                onClick={handleAddCaptionButtonClick}
                aria-disabled={!picture?.url}
                isDisabled={!picture?.url}
              >
                Add a caption
              </Button>
            </VStack>
          </Box>
          <HStack p={4}>
            <Button
              as={Link}
              to="/"
              colorScheme="cyan"
              variant="outline"
              size="sm"
              width="full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="cyan"
              size="sm"
              width="full"
              color="white"
              aria-disabled={!picture?.url}
              isDisabled={!picture?.url}
            >
              Submit
            </Button>
          </HStack>
        </Flex>
      </Flex>
    </form>
  );
};

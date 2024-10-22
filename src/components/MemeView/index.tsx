import { Box, Text } from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { useDimensions } from "@chakra-ui/react";

export type MemePictureProps = {
  pictureUrl: string;
  enableEdition?: boolean;
  texts: ReadonlyArray<{
    content?: string;
    x: number;
    y: number;
  }>;
  onPositionChange?: (index: number, x: number, y: number) => void;
  dataTestId?: string;
};

const REF_WIDTH = 800;
const REF_HEIGHT = 450;
const REF_FONT_SIZE = 36;

export const MemeView: React.FC<MemePictureProps> = ({
  pictureUrl,
  texts: rawTexts,
  dataTestId = "",
  onPositionChange,
  enableEdition = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef);
  const boxWidth = dimensions?.borderBox?.width;
  const [isDragging, setIsDragging] = useState(false);
  // this state is made to save the original position of the text we are moving
  const startPosRef = useRef({ index: -1, x: 0, y: 0 });

  const handleMouseDown = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
    index: number
  ) => {
    setIsDragging(true);
    startPosRef.current = {
      index, // we are saving the index selected
      x: e.clientX - texts?.[index]?.x, // we save the offset between the mouse position and the text position
      y: e.clientY - texts?.[index]?.y,
    };
  };

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isDragging || !enableEdition) return;

    // the new position is calculated by the difference between the mouse position and the original position
    const newLeft = e.clientX - startPosRef.current.x;
    const newTop = e.clientY - startPosRef.current.y;

    // we update the position on RHF
    onPositionChange?.(startPosRef.current.index, newLeft, newTop);
  };

  const handleMouseUp = () => setIsDragging(false);

  const { height, fontSize, texts } = useMemo(() => {
    if (!boxWidth) {
      return { height: 0, fontSize: 0, texts: rawTexts };
    }

    return {
      height: (boxWidth / REF_WIDTH) * REF_HEIGHT,
      fontSize: (boxWidth / REF_WIDTH) * REF_FONT_SIZE,
      texts: rawTexts.map((text) => ({
        ...text,
        x: (boxWidth / REF_WIDTH) * text.x,
        y: (boxWidth / REF_WIDTH) * text.y,
      })),
    };
  }, [boxWidth, rawTexts]);

  const propsEditionMode = enableEdition
    ? ({
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseUp,
      } as const)
    : {};

  return (
    <Box
      width="full"
      height={height}
      ref={containerRef}
      backgroundImage={pictureUrl}
      backgroundColor="gray.100"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="contain"
      overflow="hidden"
      position="relative"
      borderRadius={8}
      data-testid={dataTestId}
      {...propsEditionMode}
    >
      {texts.map((text, index) => (
        <Text
          key={index}
          position="absolute"
          left={text.x}
          top={text.y}
          fontSize={fontSize}
          color="white"
          fontFamily="Impact"
          fontWeight="bold"
          userSelect="none"
          textTransform="uppercase"
          style={{ WebkitTextStroke: "1px black" }}
          cursor={enableEdition ? "grabbing" : undefined}
          onMouseDown={
            enableEdition ? (e) => handleMouseDown(e, index) : undefined
          }
          data-testid={`${dataTestId}-text-${index}`}
        >
          {text.content}
        </Text>
      ))}
    </Box>
  );
};

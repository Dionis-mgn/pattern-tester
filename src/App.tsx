import React, {
  useCallback,
  DragEvent,
  useState,
  MouseEvent,
  WheelEvent,
} from "react";
import styled, { createGlobalStyle } from "styled-components";

type ImageData = string | ArrayBuffer | null | undefined;

interface ContainerProps {
  image: string;
}

const MainContainer = styled.div<ContainerProps>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background-image: url("${(props) => props.image}");
  background-repeat: repeat;
  background-size: var(--g-size);
  background-position: var(--g-offset-x) var(--g-offset-y);
`;

interface GlobalProps {
  size: number;
  offsetX: number;
  offsetY: number;
}

const GlobalStyle = createGlobalStyle<GlobalProps>`
  body {
    --g-size: ${(props) => props.size}px;
    --g-offset-x: ${(props) => props.offsetX}px;
    --g-offset-y: ${(props) => props.offsetY}px;
  }
`;

const onDragOver = (ev: DragEvent) => {
  ev.preventDefault();
};

function App() {
  const [currFile, setCurrFile] = useState<ImageData>(null);
  const [size, setSize] = useState(200);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const onDrop = useCallback(
    (ev: DragEvent) => {
      const processFile = (file: File | null) => {
        if (!file) {
          return;
        }
        const reader = new FileReader();
        reader.onload = (lev) => {
          setCurrFile(lev.target?.result);
          console.log(lev.target?.result);
        };
        reader.readAsDataURL(file);
      };

      ev.preventDefault();

      const { dataTransfer } = ev;

      if (!dataTransfer) {
        return;
      }

      if (ev.dataTransfer.items) {
        Array.from(ev.dataTransfer.items).forEach((item) => {
          if (item.kind === "file") {
            const file = item.getAsFile();
            processFile(file);
          }
        });
      } else {
        Array.from(ev.dataTransfer.files).forEach((file) => {
          processFile(file);
        });
      }
    },
    [setCurrFile]
  );

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (e.buttons === 0) {
      return;
    }
    setOffsetX((v) => v + e.movementX);
    setOffsetY((v) => v + e.movementY);
  }, []);

  const onWheel = useCallback((e: WheelEvent) => {
    console.log(e);
    setSize((s) => Math.max(s + e.deltaY, 10));
  }, []);

  return (
    <>
      <GlobalStyle size={size} offsetX={offsetX} offsetY={offsetY} />
      <MainContainer
        className="App"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onMouseMove={onMouseMove}
        onWheel={onWheel}
        image={currFile as string}
      ></MainContainer>
    </>
  );
}

export default App;

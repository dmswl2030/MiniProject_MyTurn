import { useEffect, useRef, useState } from "react";
import sprite from "../assets/character_sprite_2.png";
import { styled, keyframes } from "styled-components";

const CharAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const canvasWidth = 150;
  const canvasHeight = 500;

  const [mouseState, setMouseState] = useState(false);
  const [direction, setDirection] = useState("");
  const [movingDirection, setMovingDirection] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (canvas === null || image === null) {
      return;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const characterPosition = { x: 30, y: 30 };

    const ctx = canvas.getContext("2d");
    const spriteWidth = 32;
    const spriteHeight = 32;
    const drawWidth = 96;
    const drawHeight = 96;
    // const spriteRows = 8;
    const spriteColumns = 4;
    const spriteMargin = { top: -12, right: -65, bottom: -10, left: -66 };
    const charSpeed = 10;
    const motionSpeed = 3;
    // const LEFT_BOUNDARY = 186;
    // const RIGHT_BOUNDARY = canvas.width;
    let frameCounter = 0;

    let currentRow = 0;
    let currentColumn = 0;
    let isMoving = false;

    const keyState: { [key: string]: boolean } = {
      w: false,
      a: false,
      s: false,
      d: false,
      ArrowUp: false,
      ArrowLeft: false,
      ArrowDown: false,
      ArrowRight: false,
    };

    const draw = () => {
      updateDirection();

      if (ctx !== null) {
        ctx.imageSmoothingEnabled = false; // 이미지 스무딩을 끄기. 최적화
      }

      if (ctx === null) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#249e8c";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(
        image,
        currentColumn * spriteWidth,
        currentRow * spriteHeight,
        spriteWidth,
        spriteHeight,
        characterPosition.x - drawWidth / 2,
        characterPosition.y - drawHeight / 2,
        drawWidth,
        drawHeight
      );

      if (isMoving) {
        if (frameCounter % motionSpeed === 0) {
          // 10 프레임마다 한 번씩 업데이트
          currentColumn++;
          if (currentColumn >= spriteColumns) {
            currentColumn = 0;
          }
        }
        frameCounter++;
      } else {
        currentColumn = 0;
        frameCounter = 0;
      }

      // 경계 제약을 계산할 때 여백 크기를 고려함.
      switch (currentRow) {
        case 0:
          characterPosition.y = Math.min(
            characterPosition.y + (isMoving ? charSpeed : 0),
            canvas.height - drawHeight / 2 - spriteMargin.bottom
          );
          break; // Down
        case 1:
          characterPosition.y = Math.max(
            characterPosition.y - (isMoving ? charSpeed : 0),
            drawHeight / 2 + spriteMargin.top
          );
          break; // Up
        case 2:
          characterPosition.x = Math.min(
            characterPosition.x + (isMoving ? charSpeed : 0),
            canvas.width - drawWidth / 2 - spriteMargin.right - 40
          );
          break; // Right
        case 3:
          characterPosition.x = Math.max(
            characterPosition.x - (isMoving ? charSpeed : 0),
            drawWidth / 2 + spriteMargin.left + 40
          );
          break; // Left
      }
    };

    const updateDirection = () => {
      if (mouseState && movingDirection) {
        switch (movingDirection) {
          case "right-up":
            currentRow = 1;
            isMoving = true;
            break;
          case "left-up":
            currentRow = 3;
            isMoving = true;
            break;
          case "left-down":
            currentRow = 0;
            isMoving = true;
            break;
          case "right-down":
            currentRow = 2;
            isMoving = true;
            break;
          default:
            break;
        }
        return; // 마우스 입력이 있을 경우 키보드 입력을 무시
      }
      if (mouseState) {
        switch (direction) {
          case "right-up":
            currentRow = 1; // 예: 오른쪽 위로 이동
            isMoving = true;
            break;
          case "left-up":
            currentRow = 3; // 예: 왼쪽 위로 이동
            isMoving = true;
            break;
          case "left-down":
            currentRow = 0; // 예: 왼쪽 아래로 이동
            isMoving = true;
            break;
          case "right-down":
            currentRow = 2; // 예: 오른쪽 아래로 이동
            isMoving = true;
            break;
          default:
            break;
        }
      }

      if (keyState["w"] || keyState["ArrowUp"]) {
        currentRow = 1;
        isMoving = true;
      } else if (keyState["s"] || keyState["ArrowDown"]) {
        currentRow = 0;
        isMoving = true;
      } else if (keyState["a"] || keyState["ArrowLeft"]) {
        currentRow = 3;
        isMoving = true;
      } else if (keyState["d"] || keyState["ArrowRight"]) {
        currentRow = 2;
        isMoving = true;
      } else {
        isMoving = false;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // console.log("Key Down:", e.key);
      keyState[e.key] = true;
      switch (e.key) {
        case "w":
        case "ArrowUp":
          currentRow = 1;
          isMoving = true;
          break;
        case "a":
        case "ArrowLeft":
          currentRow = 3;
          isMoving = true;
          break;
        case "s":
        case "ArrowDown":
          currentRow = 0;
          isMoving = true;
          break;
        case "d":
        case "ArrowRight":
          currentRow = 2;
          isMoving = true;
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keyState[e.key] = false;
      if (["w", "a", "s", "d", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"].includes(e.key)) {
        isMoving = false;
        currentColumn = 0;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const relativeX = e.clientX - rect.left - characterPosition.x;
        const relativeY = e.clientY - rect.top - characterPosition.y;

        let clickedDirection = "";
        if (relativeX >= 0 && relativeY < 0) clickedDirection = "right-up";
        else if (relativeX < 0 && relativeY < 0) clickedDirection = "left-up";
        else if (relativeX < 0 && relativeY >= 0) clickedDirection = "left-down";
        else if (relativeX >= 0 && relativeY >= 0) clickedDirection = "right-down";

        if (clickedDirection === movingDirection) {
          setMovingDirection(null);
          setMouseState(false);
        } else {
          setMovingDirection(clickedDirection);
          setMouseState(true);
          setDirection(clickedDirection);
        }
      }
    };

    const handleMouseUp = () => {
      setMouseState(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const relativeX = e.clientX - rect.left - characterPosition.x;
        const relativeY = e.clientY - rect.top - characterPosition.y;

        let movingDirection = "";
        if (relativeX >= 0 && relativeY < 0) movingDirection = "right-up";
        else if (relativeX < 0 && relativeY < 0) movingDirection = "left-up";
        else if (relativeX < 0 && relativeY >= 0) movingDirection = "left-down";
        else if (relativeX >= 0 && relativeY >= 0) movingDirection = "right-down";

        setMovingDirection(movingDirection);
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    image.onload = () => {
      // 이미지 로드 후 게임 루프 시작
      gameLoop();
    };

    const gameLoop = () => {
      draw();
      requestAnimationFrame(gameLoop);
    };

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("mousedown", handleMouseDown); // 마우스 클릭 이벤트 리스너 제거
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <CanvasContainer>
      <CharGuideText>
        키보드 방향키로
        <br />
        캐릭터를 움직여보세요
      </CharGuideText>
      <StyledCanvas ref={canvasRef} width={canvasWidth} height={canvasHeight}></StyledCanvas>
      <img ref={imageRef} src={sprite} style={{ display: "none" }} />
    </CanvasContainer>
  );
};

export default CharAnimation;

const CanvasContainer = styled.div.attrs({ className: "canvas-container" })``;

const StyledCanvas = styled.canvas``;

const blinkAnimation = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const CharGuideText = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.gray[1]};
  animation: ${blinkAnimation} 2s ease-in-out 3;
  opacity: 0;
`;

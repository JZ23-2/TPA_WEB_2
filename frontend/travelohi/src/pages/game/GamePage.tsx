import React, { useEffect, useRef, useState } from "react";
import background from "../../assets/others/GameAsset/background/background.png";
import lifebar from "../../assets/others/GameAsset/lifebar full.png";
import Hero from "./Hero";
import draw from "../../assets/others/GameAsset/draw.png";
import win from "../../assets/others/GameAsset/win.png";
import lose from "../../assets/others/GameAsset/lose.png";
import { useNavigate } from "react-router-dom";
import Enemy from "./Enemy";
import client from "../../client/client";
import music from "../../assets/others/GameAsset/music1.mp3";
import { useUserAuth } from "../../context/UserContext";
import axios from "axios";

const GamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { user, update } = useUserAuth();
  const [hero, setHero] = useState(new Hero(100, 350, 200, 300));
  const [enemy, setEnemy] = useState(new Enemy(1200, 350, 200, 300));
  const [isMovingLeft, setIsMovingLeft] = useState(false);
  const [isMovingRight, setIsMovingRight] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isKPressed, setIsKPressed] = useState(false);
  const [isSpressed, setIsSpressed] = useState(false);
  const [isApresed, setIsApressed] = useState(false);
  const playerId = useRef<number | null>(null);
  const backgroundMusic = new Audio();
  backgroundMusic.src = music;
  backgroundMusic.loop = true;
  let timer = 250;
  const navigate = useNavigate();
  let userID = user?.userID;
  useEffect(() => {
    client.on("playerId", (id: number) => {
      playerId.current = id;
    });

    client.on("roomFull", () => {
      alert("Room Is Full!");
      navigate("/home-page");
    });

    client.on(
      "opponentAction",
      (data: {
        playerId: number;
        heroPositionX: number;
        heroPositionY: number;
        enemyPositionX: number;
        enemyPositionY: number;
        heroHealth: number;
        enemyHealth: number;
        action: string;
      }) => {
        if (data.action === "right" && data.playerId === 1) {
          setIsMovingRight(true);
          setIsKPressed(true);
          setHero((prevEnemy) => {
            prevEnemy.setState("right");
            prevEnemy.setHeroX(data.heroPositionX);
            prevEnemy.setHeroY(data.heroPositionY);
            prevEnemy.setHealth(data.heroHealth);
            return prevEnemy;
          });
        } else if (data.action === "idle" && data.playerId === 1) {
          setHero((prevHero) => {
            prevHero.setHeroX(data.heroPositionX);
            prevHero.setHeroY(data.heroPositionY);
            prevHero.setState("idle");
            prevHero.setHealth(data.heroHealth);
            return prevHero;
          });
        } else if (data.action === "left" && data.playerId === 1) {
          setIsMovingLeft(true);
          setIsApressed(true);
          setHero((prevHero) => {
            prevHero.setState("left");
            prevHero.setHeroX(data.heroPositionX);
            prevHero.setHeroY(data.heroPositionY);
            prevHero.setHealth(data.heroHealth);
            return prevHero;
          });
        } else if (data.action === "left" && data.playerId === 2) {
          setIsMovingLeft(true);
          setIsApressed(true);
          setEnemy((prevEnemy) => {
            prevEnemy.setState("left");
            prevEnemy.setHeroX(data.enemyPositionX);
            prevEnemy.setHeroY(data.enemyPositionY);
            prevEnemy.setHealth(data.enemyHealth);
            return prevEnemy;
          });
        } else if (data.action === "idle" && data.playerId === 2) {
          setEnemy((prevEnemy) => {
            prevEnemy.setHeroX(data.enemyPositionX);
            prevEnemy.setHeroY(data.enemyPositionY);
            prevEnemy.setState("idle");
            prevEnemy.setHealth(data.enemyHealth);
            return prevEnemy;
          });
        } else if (data.action === "right" && data.playerId === 2) {
          setIsMovingRight(true);
          setIsKPressed(true);
          setEnemy((prevEnemy) => {
            prevEnemy.setState("right");
            prevEnemy.setHeroX(data.enemyPositionX);
            prevEnemy.setHeroY(data.enemyPositionY);
            prevEnemy.setHealth(data.enemyHealth);
            return prevEnemy;
          });
        } else if (data.action === "jump" && data.playerId === 1) {
          setHero((prevHero) => {
            prevHero.setState("jump");
            prevHero.setHeroX(data.heroPositionX);
            prevHero.setHeroY(data.heroPositionY);
            prevHero.setHealth(data.heroHealth);
            return prevHero;
          });
        } else if (data.action === "rightFrontKick" && data.playerId === 1) {
          setHero((prevHero) => {
            prevHero.setState("rightFrontKick");
            prevHero.setHeroX(data.heroPositionX);
            prevHero.setHeroY(data.heroPositionY);
            prevHero.setHealth(data.heroHealth);
            return prevHero;
          });
        } else if (
          data.action === "rightFrontMirrorKick" &&
          data.playerId === 1
        ) {
          setHero((prevHero) => {
            prevHero.setState("rightFrontMirrorKick");
            prevHero.setHeroX(data.heroPositionX);
            prevHero.setHeroY(data.heroPositionY);
            prevHero.setHealth(data.heroHealth);
            return prevHero;
          });
        } else if (data.action === "rightLowKick" && data.playerId === 1) {
          setHero((prevHero) => {
            prevHero.setState("rightLowKick");
            prevHero.setHeroX(data.heroPositionX);
            prevHero.setHeroY(data.heroPositionY);
            prevHero.setHealth(data.heroHealth);
            return prevHero;
          });
        } else if (data.action === "leftLowKick" && data.playerId === 1) {
          setHero((prevHero) => {
            prevHero.setState("leftLowKick");
            prevHero.setHeroX(data.heroPositionX);
            prevHero.setHeroY(data.heroPositionY);
            prevHero.setHealth(data.heroHealth);
            return prevHero;
          });
        } else if (
          data.action === "damageRightFrontKick" &&
          data.playerId === 1
        ) {
          setHero((prevHero) => {
            prevHero.setState("rightFrontKick");
            prevHero.setHeroX(data.heroPositionX);
            prevHero.setHeroY(data.heroPositionY);
            prevHero.setHealth(data.heroHealth);
            return prevHero;
          });

          setEnemy((prevEnemy) => {
            prevEnemy.setHealth(data.enemyHealth);
            return prevEnemy;
          });
        } else if (
          data.action === "damageRightMirrorFrontKick" &&
          data.playerId === 1
        ) {
          setHero((prevHero) => {
            prevHero.setState("rightFrontMirrorKick");
            prevHero.setHeroX(data.heroPositionX);
            prevHero.setHeroY(data.heroPositionY);
            prevHero.setHealth(data.heroHealth);
            return prevHero;
          });

          setEnemy((prevEnemy) => {
            prevEnemy.setHealth(data.enemyHealth);
            return prevEnemy;
          });
        } else if (
          data.action === "damageRightLowKick" &&
          data.playerId === 1
        ) {
          setHero((prevHero) => {
            prevHero.setState("rightLowKick");
            prevHero.setHeroX(data.heroPositionX);
            prevHero.setHeroY(data.heroPositionY);
            prevHero.setHealth(data.heroHealth);
            return prevHero;
          });

          setEnemy((prevEnemy) => {
            prevEnemy.setHealth(data.enemyHealth);
            return prevEnemy;
          });
        } else if (data.action === "damageLeftLowKick" && data.playerId === 1) {
          setHero((prevHero) => {
            prevHero.setState("leftLowKick");
            prevHero.setHeroX(data.heroPositionX);
            prevHero.setHeroY(data.heroPositionY);
            prevHero.setHealth(data.heroHealth);
            return prevHero;
          });

          setEnemy((prevEnemy) => {
            prevEnemy.setHealth(data.enemyHealth);
            return prevEnemy;
          });
        } else if (
          data.action === "rightFrontMirrorKick" &&
          data.playerId === 2
        ) {
          setEnemy((prevHero) => {
            prevHero.setState("leftFrontKick");
            prevHero.setHeroX(data.enemyPositionX);
            prevHero.setHeroY(data.enemyPositionY);
            prevHero.setHealth(data.enemyHealth);
            return prevHero;
          });
        } else if (data.action === "rightFrontKick" && data.playerId === 2) {
          setEnemy((prevHero) => {
            prevHero.setState("rightFrontKick");
            prevHero.setHeroX(data.enemyPositionX);
            prevHero.setHeroY(data.enemyPositionY);
            prevHero.setHealth(data.enemyHealth);
            return prevHero;
          });
        } else if (data.action === "enemyRightLowKick" && data.playerId === 2) {
          setEnemy((prevHero) => {
            prevHero.setState("rightLowKick");
            prevHero.setHeroX(data.enemyPositionX);
            prevHero.setHeroY(data.enemyPositionY);
            prevHero.setHealth(data.enemyHealth);
            return prevHero;
          });
        } else if (data.action === "enemyLeftLowKick" && data.playerId === 2) {
          setEnemy((prevHero) => {
            prevHero.setState("leftLowKick");
            prevHero.setHeroX(data.enemyPositionX);
            prevHero.setHeroY(data.enemyPositionY);
            prevHero.setHealth(data.enemyHealth);
            return prevHero;
          });
        } else if (
          data.action === "damageEnemyRightFrontKick" &&
          data.playerId === 2
        ) {
          setEnemy((prevHero) => {
            prevHero.setState("rightFrontKick");
            prevHero.setHeroX(data.enemyPositionX);
            prevHero.setHeroY(data.enemyPositionY);
            prevHero.setHealth(data.enemyHealth);
            return prevHero;
          });

          setHero((prevEnemy) => {
            prevEnemy.setHealth(data.heroHealth);
            return prevEnemy;
          });
        } else if (
          data.action === "damageEnemyRightMirrorFrontKick" &&
          data.playerId === 2
        ) {
          setEnemy((prevHero) => {
            prevHero.setState("leftFrontKick");
            prevHero.setHeroX(data.enemyPositionX);
            prevHero.setHeroY(data.enemyPositionY);
            prevHero.setHealth(data.enemyHealth);
            return prevHero;
          });

          setHero((prevEnemy) => {
            prevEnemy.setHealth(data.heroHealth);
            return prevEnemy;
          });
        } else if (
          data.action === "damageEnemyRightLowKick" &&
          data.playerId === 2
        ) {
          setEnemy((prevHero) => {
            prevHero.setState("rightLowKick");
            prevHero.setHeroX(data.enemyPositionX);
            prevHero.setHeroY(data.enemyPositionY);
            prevHero.setHealth(data.enemyHealth);
            return prevHero;
          });

          setHero((prevEnemy) => {
            prevEnemy.setHealth(data.heroHealth);
            return prevEnemy;
          });
        } else if (
          data.action === "damageEnemyLeftLowKick" &&
          data.playerId === 2
        ) {
          setEnemy((prevHero) => {
            prevHero.setState("leftLowKick");
            prevHero.setHeroX(data.enemyPositionX);
            prevHero.setHeroY(data.enemyPositionY);
            prevHero.setHealth(data.enemyHealth);
            return prevHero;
          });

          setHero((prevEnemy) => {
            prevEnemy.setHealth(data.heroHealth);
            return prevEnemy;
          });
        }
      }
    );

    client.on(
      "broadCastMessage",
      (data: { positionX: number; positionY: number }) => {
        console.log(data.positionX, data.positionY);
      }
    );

    return () => {
      client.off("playerId");
      client.off("roomFull");
    };
  }, []);

  const sendEnterGame = (action: string) => {
    client.emit("enterGame", {
      playerId: playerId.current,
      heroPositionX: hero.getHeroX(),
      heroPositionY: hero.getHeroY(),
      enemyPositionX: enemy.getHeroX(),
      enemyPositionY: enemy.getHeroY(),
      heroHealth: hero.getHealth(),
      enemyHealth: enemy.getHealth(),
      action: action,
    });
  };

  const refetchUser = () => {
    axios
      .get("http://localhost:8080/api/user/refetch-user", {
        params: {
          ID: user?.userID,
        },
      })
      .then((res) => {
        update(res.data);
      });
  };

  // useEffect(() => {
  //   console.log(userID);
  //   axios
  //     .get("http://localhost:8080/api/game/win-game", {
  //       params: {
  //         UserID: userID,
  //       },
  //     })
  //     .then(() => {
  //       // navigate("/");
  //       console.log("saya udah masuk")
  //       // refetchUser();
  //     });
  // }, [hero.getCanMove() == false, enemy.getCanMove() == false]);

  const winReward = () => {
    axios
      .get("http://localhost:8080/api/game/win-game", {
        params: {
          UserID: userID,
        },
      })
      .then(() => {
        // navigate("/");
        console.log("saya udah masuk");
        // refetchUser();
      });
  };

  console.log(hero.getHealth(), enemy.getHealth());

  const handleKeyDown = (e: KeyboardEvent) => {
    if (hero.getCanMove() === true || enemy.getCanMove() === true) {
      if (e.key === "d") {
        sendEnterGame("right");
      } else if (isKPressed && e.key === " ") {
        sendEnterGame("rightFrontKick");
        if (checkCollision(hero.collisionBox, enemy.collisionBox)) {
          sendEnterGame("damageRightFrontKick");
        }

        if (checkCollision(enemy.collisionBox, hero.collisionBox)) {
          sendEnterGame("damageEnemyRightFrontKick");
        }
      } else if (e.key === "a") {
        sendEnterGame("left");
      } else if (isApresed && e.key === " ") {
        sendEnterGame("rightFrontMirrorKick");
        if (checkCollision(hero.collisionBox, enemy.collisionBox)) {
          sendEnterGame("damageRightMirrorFrontKick");
        }

        if (checkCollision(enemy.collisionBox, hero.collisionBox)) {
          sendEnterGame("damageEnemyRightMirrorFrontKick");
        }
      } else if (e.key === "s") {
        setIsSpressed(true);
      } else if (e.key === " " && isSpressed) {
        if (hero.getState() === "idle") {
          sendEnterGame("rightLowKick");
          if (checkCollision(hero.collisionBox, enemy.collisionBox)) {
            sendEnterGame("damageRightLowKick");
          }
        } else if (hero.getState() === "idleMirror") {
          sendEnterGame("leftLowKick");
          if (checkCollision(hero.collisionBox, enemy.collisionBox)) {
            sendEnterGame("damageLeftLowKick");
          }
        }

        if (enemy.getState() === "idle") {
          sendEnterGame("enemyRightLowKick");
          if (checkCollision(enemy.collisionBox, hero.collisionBox)) {
            sendEnterGame("damageEnemyRightLowKick");
          }
        } else if (enemy.getState() === "idleMirror") {
          sendEnterGame("enemyLeftLowKick");
          if (checkCollision(enemy.collisionBox, hero.collisionBox)) {
            sendEnterGame("damageEnemyLeftLowKick");
          }
        }
      } else if (e.key === "w" && !isJumping) {
        setIsJumping(true);

        const jumpDuration = 1000;
        const jumpHeight = 200;

        let jumpStart = Date.now();

        const jump = () => {
          const now = Date.now();
          const elapsed = now - jumpStart;

          if (elapsed < jumpDuration) {
            const jumpProgress = 1 - elapsed / jumpDuration;
            const jumpDelta = jumpHeight * Math.sin(jumpProgress * Math.PI);

            setHero((prevHero) => {
              prevHero.setState("jump");
              const jumpXDelta = isMovingRight ? 5 : isMovingLeft ? -5 : 0;
              prevHero.setHeroX(prevHero.getHeroX() + jumpXDelta);
              prevHero.setHeroY(350 - jumpDelta);
              return prevHero;
            });

            requestAnimationFrame(jump);
          } else {
            setIsJumping(false);

            setHero((prevHero) => {
              prevHero.setState("idle");
              prevHero.setHeroY(350);
              return prevHero;
            });
          }
        };

        jump();
      }
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "d") {
      sendEnterGame("idle");
      if (isKPressed === true) {
        setIsKPressed(false);
        setHero((prevHero) => {
          prevHero.setState("idle");
          return prevHero;
        });
      }
    } else if (e.key === "a") {
      setIsMovingLeft(false);
      sendEnterGame("idle");
      if (isApresed === true) {
        setIsApressed(false);
        setHero((prevHero) => {
          prevHero.setState("idle");
          return prevHero;
        });
      }
    } else if (e.key === "s") {
      setIsSpressed(false);
      sendEnterGame("idle");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    setInterval(() => {
      if (timer != 0) {
        timer -= 1;
      } else if (timer == 0) {
        timer = 0;
      }
    }, 1000);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isJumping, isSpressed, isKPressed, isApresed]);

  const checkCollision = (boxA: any, boxB: any) => {
    return (
      boxA.x < boxB.x + boxB.width &&
      boxA.x + boxA.width > boxB.x &&
      boxA.y < boxB.y + boxB.height &&
      boxA.y + boxA.height > boxB.y
    );
  };

  const drawCollisionBoxes = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "red";
    ctx.strokeRect(
      hero.collisionBox.x,
      hero.collisionBox.y,
      hero.collisionBox.width,
      hero.collisionBox.height
    );

    ctx.strokeStyle = "green";
    ctx.strokeRect(
      enemy.collisionBox.x,
      enemy.collisionBox.y,
      enemy.collisionBox.width,
      enemy.collisionBox.height
    );
  };

  const animate = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        hero.setHeroX(
          Math.max(0, Math.min(1450 - hero.getHeroWidth(), hero.getHeroX()))
        );
        enemy.setHeroX(
          Math.max(0, Math.min(1450 - enemy.getHeroWidth(), enemy.getHeroX()))
        );
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const backgroundImage = new Image();
        backgroundImage.src = background;

        const lifebarImage = new Image();
        lifebarImage.src = lifebar;

        const drawImage = new Image();
        drawImage.src = draw;

        const winImage = new Image();
        winImage.src = win;

        const loseImage = new Image();
        loseImage.src = lose;

        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "blue";
        ctx.fillRect(180, 40, hero.getHealth() * 4.6, 15);
        ctx.fillStyle = "blue";
        ctx.save();
        ctx.translate(window.innerWidth, 0);
        ctx.scale(-1, 1);
        ctx.fillRect(140, 40, enemy.getHealth() * 4.6, 15);
        ctx.restore();
        ctx.drawImage(lifebarImage, -10, -10, 1500, 100);

        hero.animate(ctx);
        enemy.animate(ctx);
        hero.updateCollisionBox();
        enemy.updateCollisionBox();

        drawCollisionBoxes(ctx);
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(`${timer}`, 728, 50);

        if (enemy.getState() === "idle" || enemy.getState() === "idleMirror") {
          if (enemy.getHeroX() > hero.getHeroX()) {
            enemy.setState("idleMirror");
          } else if (enemy.getHeroX() < hero.getHeroX()) {
            enemy.setState("idle");
          }
        }

        if (hero.getState() === "idle" || hero.getState() === "idleMirror") {
          if (hero.getHeroX() > enemy.getHeroX()) {
            hero.setState("idleMirror");
          } else if (hero.getHeroX() < enemy.getHeroX()) {
            hero.setState("idle");
          }
        }

        console.log(enemy.getHealth(), hero.getHealth());

        if (enemy.getHealth() <= 0) {
          if (playerId.current === 1) {
            ctx.drawImage(winImage, 600, 200, 300, 300);
            hero.setCanMove(false);
            enemy.setCanMove(false);
            client.disconnect();
            backgroundMusic.pause();
            setTimeout(() => {
              winReward();
              refetchUser();
              navigate("/home-page");
            }, 3000);
          } else if (playerId.current === 2) {
            ctx.drawImage(loseImage, 600, 200, 300, 300);
            hero.setCanMove(false);
            enemy.setCanMove(false);
            client.disconnect();
            backgroundMusic.pause();
            setTimeout(() => {
              navigate("/home-page");
            }, 3000);
          }
        } else if (hero.getHealth() <= 0) {
          if (playerId.current === 1) {
            ctx.drawImage(loseImage, 600, 200, 300, 300);
            hero.setCanMove(false);
            enemy.setCanMove(false);
            client.disconnect();
            backgroundMusic.pause();
            setTimeout(() => {
              navigate("/home-page");
            }, 3000);
          } else if (playerId.current === 2) {
            ctx.drawImage(winImage, 600, 200, 300, 300);
            hero.setCanMove(false);
            enemy.setCanMove(false);
            client.disconnect();
            backgroundMusic.pause();
            setTimeout(() => {
              winReward();
              refetchUser();
              navigate("/home-page");
              refetchUser();
            }, 3000);
          }
        }

        if (timer == 0) {
          ctx.drawImage(drawImage, 600, 200, 300, 300);
          hero.setCanMove(false);
          enemy.setCanMove(false);
          setTimeout(() => {
            navigate("/home-page");
          }, 3000);
        }
        requestAnimationFrame(animate);
      }
    }
  };

  useEffect(() => {
    window.onclick = () => {
      backgroundMusic.play();
    };
  }, []);

  useEffect(() => {
    animate();
  }, []);

  return <canvas ref={canvasRef} width={1600} height={703} />;
};

export default GamePage;

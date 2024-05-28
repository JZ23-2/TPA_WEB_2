import enemy1 from "../../assets/others/GameAsset/sword impulse/idle/sword-impulse_01.png";
import enemy2 from "../../assets/others/GameAsset/sword impulse/idle/sword-impulse_02.png";
import enemy3 from "../../assets/others/GameAsset/sword impulse/idle/sword-impulse_03.png";
import enemy4 from "../../assets/others/GameAsset/sword impulse/idle/sword-impulse_04.png";
import enemy5 from "../../assets/others/GameAsset/sword impulse/idle/sword-impulse_05.png";
import enemy6 from "../../assets/others/GameAsset/sword impulse/idle/sword-impulse_06.png";

import enemymirror1 from "../../assets/others/GameAsset/sword impulse/idle mirrored/sword-impulse_01.png";
import enemymirror2 from "../../assets/others/GameAsset/sword impulse/idle mirrored/sword-impulse_02.png";
import enemymirror3 from "../../assets/others/GameAsset/sword impulse/idle mirrored/sword-impulse_03.png";
import enemymirror4 from "../../assets/others/GameAsset/sword impulse/idle mirrored/sword-impulse_04.png";
import enemymirror5 from "../../assets/others/GameAsset/sword impulse/idle mirrored/sword-impulse_05.png";
import enemymirror6 from "../../assets/others/GameAsset/sword impulse/idle mirrored/sword-impulse_06.png";

import leftWalk1 from "../../assets/others/GameAsset/sword impulse/backward/sword-impulse_1.png";
import leftWalk2 from "../../assets/others/GameAsset/sword impulse/backward/sword-impulse_2.png";
import leftWalk3 from "../../assets/others/GameAsset/sword impulse/backward/sword-impulse_3.png";
import leftWalk4 from "../../assets/others/GameAsset/sword impulse/backward/sword-impulse_4.png";
import leftWalk5 from "../../assets/others/GameAsset/sword impulse/backward/sword-impulse_5.png";
import leftWalk6 from "../../assets/others/GameAsset/sword impulse/backward/sword-impulse_6.png";
import leftWalk7 from "../../assets/others/GameAsset/sword impulse/backward/sword-impulse_7.png";
import leftWalk8 from "../../assets/others/GameAsset/sword impulse/backward/sword-impulse_8.png";
import leftWalk9 from "../../assets/others/GameAsset/sword impulse/backward/sword-impulse_9.png";
import leftWalk10 from "../../assets/others/GameAsset/sword impulse/backward/sword-impulse_10.png";

import rightWalk1 from "../../assets/others/GameAsset/sword impulse/walking/sword-impulse_1.png";
import rightWalk2 from "../../assets/others/GameAsset/sword impulse/walking/sword-impulse_2.png";
import rightWalk3 from "../../assets/others/GameAsset/sword impulse/walking/sword-impulse_3.png";
import rightWalk4 from "../../assets/others/GameAsset/sword impulse/walking/sword-impulse_4.png";
import rightWalk5 from "../../assets/others/GameAsset/sword impulse/walking/sword-impulse_5.png";
import rightWalk6 from "../../assets/others/GameAsset/sword impulse/walking/sword-impulse_6.png";
import rightWalk7 from "../../assets/others/GameAsset/sword impulse/walking/sword-impulse_7.png";
import rightWalk8 from "../../assets/others/GameAsset/sword impulse/walking/sword-impulse_8.png";
import rightWalk9 from "../../assets/others/GameAsset/sword impulse/walking/sword-impulse_9.png";
import rightWalk10 from "../../assets/others/GameAsset/sword impulse/walking/sword-impulse_10.png";

import leftFrontKick1 from "../../assets/others/GameAsset/sword impulse/front kick mirrored/sword-impulse_01.png";
import leftFrontKick2 from "../../assets/others/GameAsset/sword impulse/front kick mirrored/sword-impulse_02.png";
import leftFrontKick3 from "../../assets/others/GameAsset/sword impulse/front kick mirrored/sword-impulse_03.png";
import leftFrontKick4 from "../../assets/others/GameAsset/sword impulse/front kick mirrored/sword-impulse_04.png";

import rightFrontKick1 from "../../assets/others/GameAsset/sword impulse/front kick/sword-impulse_01.png";
import rightFrontKick2 from "../../assets/others/GameAsset/sword impulse/front kick/sword-impulse_02.png";
import rightFrontKick3 from "../../assets/others/GameAsset/sword impulse/front kick/sword-impulse_03.png";
import rightFrontKick4 from "../../assets/others/GameAsset/sword impulse/front kick/sword-impulse_04.png";

import leftLowKick1 from "../../assets/others/GameAsset/sword impulse/low kick mirrored/sword-impulse_01.png";
import leftLowKick2 from "../../assets/others/GameAsset/sword impulse/low kick mirrored/sword-impulse_02.png";
import leftLowKick3 from "../../assets/others/GameAsset/sword impulse/low kick mirrored/sword-impulse_03.png";

import rightLowKick1 from "../../assets/others/GameAsset/sword impulse/low kick/sword-impulse_01.png";
import rightLowKick2 from "../../assets/others/GameAsset/sword impulse/low kick/sword-impulse_02.png";
import rightLowKick3 from "../../assets/others/GameAsset/sword impulse/low kick/sword-impulse_03.png";

class Enemy {
  updateCollisionBox() {
    this.collisionBox = {
      x: this.heroX,
      y: this.heroY,
      width: this.heroWidth,
      height: this.heroHeight,
    };
  }
  private heroX: number;
  private heroY: number;
  private heroWidth: number;
  private heroHeight: number;
  private state: string;
  private health: number;
  private canMove: boolean;
  private damage: number;
  private idleImages: HTMLImageElement[];
  private idleMirrorImages: HTMLImageElement[];
  private leftWalkImages: HTMLImageElement[];
  private rightWalkImages: HTMLImageElement[];
  private leftFrontKickImages: HTMLImageElement[];
  private rightFrontKickImages: HTMLImageElement[];
  private leftLowKickImages: HTMLImageElement[];
  private rightLowKickImages: HTMLImageElement[];
  private currentSpriteIndex: number;
  collisionBox: { x: number; y: number; width: number; height: number };

  constructor(
    heroX: number,
    heroY: number,
    heroWidth: number,
    heroHeight: number,
    idleImages: string[] = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6],
    walkLeftImages: string[] = [
      leftWalk1,
      leftWalk2,
      leftWalk3,
      leftWalk4,
      leftWalk5,
      leftWalk6,
      leftWalk7,
      leftWalk8,
      leftWalk9,
      leftWalk10,
    ],
    idleMirrorImages: string[] = [
      enemymirror1,
      enemymirror2,
      enemymirror3,
      enemymirror4,
      enemymirror5,
      enemymirror6,
    ],
    walkRightImages: string[] = [
      rightWalk1,
      rightWalk2,
      rightWalk3,
      rightWalk4,
      rightWalk5,
      rightWalk6,
      rightWalk7,
      rightWalk8,
      rightWalk9,
      rightWalk10,
    ],
    leftFrontKickImages: string[] = [
      leftFrontKick1,
      leftFrontKick2,
      leftFrontKick3,
      leftFrontKick4,
    ],
    rightFrontKickImages: string[] = [
      rightFrontKick1,
      rightFrontKick2,
      rightFrontKick3,
      rightFrontKick4,
    ],
    leftLowKickImages: string[] = [leftLowKick1, leftLowKick2, leftLowKick3],
    rightLowKickImages: string[] = [
      rightLowKick1,
      rightLowKick2,
      rightLowKick3,
    ],
    state: string = "idle",
    health: number = 100,
    canMove: boolean = true,
    damage: number = 0
  ) {
    this.heroX = heroX;
    this.heroY = heroY;
    this.heroWidth = heroWidth;
    this.heroHeight = heroHeight;
    this.idleImages = idleImages.map((src) => {
      const spriteImage = new Image();
      spriteImage.src = src;
      return spriteImage;
    });
    this.idleMirrorImages = idleMirrorImages.map((src) => {
      const spriteImage = new Image();
      spriteImage.src = src;
      return spriteImage;
    });
    this.leftWalkImages = walkLeftImages.map((src) => {
      const spriteImage = new Image();
      spriteImage.src = src;
      return spriteImage;
    });
    this.rightWalkImages = walkRightImages.map((src) => {
      const spriteImage = new Image();
      spriteImage.src = src;
      return spriteImage;
    });
    this.leftFrontKickImages = leftFrontKickImages.map((src) => {
      const spriteImage = new Image();
      spriteImage.src = src;
      return spriteImage;
    });
    this.rightFrontKickImages = rightFrontKickImages.map((src) => {
      const spriteImage = new Image();
      spriteImage.src = src;
      return spriteImage;
    });
    this.leftLowKickImages = leftLowKickImages.map((src) => {
      const spriteImage = new Image();
      spriteImage.src = src;
      return spriteImage;
    });
    this.rightLowKickImages = rightLowKickImages.map((src) => {
      const spriteImage = new Image();
      spriteImage.src = src;
      return spriteImage;
    });
    this.state = state;
    this.currentSpriteIndex = 0;
    this.health = health;
    this.canMove = canMove;
    this.damage = damage;
    this.collisionBox = {
      x: this.heroX,
      y: this.heroY,
      width: this.heroWidth,
      height: this.heroHeight,
    };
  }

  private getSpriteImages(): HTMLImageElement[] {
    if (this.canMove == true) {
      switch (this.state) {
        case "idleMirror":
          return this.idleMirrorImages;
        case "left":
          return this.leftWalkImages;
        case "right":
          return this.rightWalkImages;
        case "leftFrontKick":
          return this.leftFrontKickImages;
        case "rightFrontKick":
          return this.rightFrontKickImages;
        case "leftLowKick":
          return this.leftLowKickImages;
        case "rightLowKick":
          return this.rightLowKickImages;
        default:
          return this.idleImages;
      }
    }

    switch (this.state) {
      default:
        return this.idleImages;
    }
  }

  public animateSprite(ctx: CanvasRenderingContext2D): void {
    const currentFrame = this.getSpriteImages();
    let currentImage = currentFrame[this.currentSpriteIndex];
    currentImage = currentFrame[Math.floor(this.currentSpriteIndex / 6)];
    this.currentSpriteIndex =
      (this.currentSpriteIndex + 1) % (currentFrame.length * 6);
    if (currentImage instanceof HTMLImageElement) {
      ctx.drawImage(
        currentImage,
        this.heroX,
        this.heroY,
        this.heroWidth,
        this.heroHeight
      );
    }
  }

  public animate(ctx: CanvasRenderingContext2D): void {
    this.animateSprite(ctx);
  }

  public getHeroX(): number {
    return this.heroX;
  }

  public getHeroY(): number {
    return this.heroY;
  }

  public getHeroWidth(): number {
    return this.heroWidth;
  }

  public getHeroHeight(): number {
    return this.heroHeight;
  }

  public getState(): string {
    return this.state;
  }

  public getHealth(): number {
    return this.health;
  }

  public getCanMove(): boolean {
    return this.canMove;
  }

  public getDamage(): number {
    return this.damage;
  }

  public setHeroX(heroX: number): void {
    this.heroX = heroX;
  }

  public setHeroY(heroY: number): void {
    this.heroY = heroY;
  }

  public setHeroWidth(heroWidth: number): void {
    this.heroWidth = heroWidth;
  }

  public setHeroHeight(heroHeight: number): void {
    this.heroHeight = heroHeight;
  }

  public setState(state: string): void {
    this.state = state;
  }

  public setHealth(health: number): void {
    this.health = health;
  }

  public setCanMove(canMove: boolean): void {
    this.canMove = canMove;
  }

  public setDamage(damage: number): void {
    this.damage = damage;
  }
}

export default Enemy;

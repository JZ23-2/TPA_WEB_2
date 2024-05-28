import idle1 from "../../assets/others/GameAsset/blastimpulse/idle/idle1.png";
import idle2 from "../../assets/others/GameAsset/blastimpulse/idle/idle2.png";
import idle3 from "../../assets/others/GameAsset/blastimpulse/idle/idle3.png";
import idle4 from "../../assets/others/GameAsset/blastimpulse/idle/idle4.png";
import idle5 from "../../assets/others/GameAsset/blastimpulse/idle/idle5.png";
import idle6 from "../../assets/others/GameAsset/blastimpulse/idle/idle6.png";

import idleMirror1 from "../../assets/others/GameAsset/blastimpulse/idle mirrored/idle 1.png";
import idleMirror2 from "../../assets/others/GameAsset/blastimpulse/idle mirrored/idle 2.png";
import idleMirror3 from "../../assets/others/GameAsset/blastimpulse/idle mirrored/idle 3.png";
import idleMirror4 from "../../assets/others/GameAsset/blastimpulse/idle mirrored/idle 4.png";
import idleMirror5 from "../../assets/others/GameAsset/blastimpulse/idle mirrored/idle 5.png";
import idleMirror6 from "../../assets/others/GameAsset/blastimpulse/idle mirrored/idle 6.png";

import walk1 from "../../assets/others/GameAsset/blastimpulse/walking/1.png";
import walk2 from "../../assets/others/GameAsset/blastimpulse/walking/2.png";
import walk3 from "../../assets/others/GameAsset/blastimpulse/walking/3.png";

import walkmLeft1 from "../../assets/others/GameAsset/blastimpulse/walking mirrored/1.png";
import walkmLeft2 from "../../assets/others/GameAsset/blastimpulse/walking mirrored/2.png";
import walkmLeft3 from "../../assets/others/GameAsset/blastimpulse/walking mirrored/3.png";

import jump from "../../assets/others/GameAsset/blastimpulse/jump/1.png";

import lowkick1 from "../../assets/others/GameAsset/blastimpulse/low kick/1.png";
import lowkick2 from "../../assets/others/GameAsset/blastimpulse/low kick/2.png";
import lowkick3 from "../../assets/others/GameAsset/blastimpulse/low kick/3.png";
import lowkick4 from "../../assets/others/GameAsset/blastimpulse/low kick/4.png";

import frontkickf1 from "../../assets/others/GameAsset/blastimpulse/front kick/1.png";
import frontkickf2 from "../../assets/others/GameAsset/blastimpulse/front kick/2.png";
import frontkickf3 from "../../assets/others/GameAsset/blastimpulse/front kick/3.png";

import frontMirrorKick1 from "../../assets/others/GameAsset/blastimpulse/front kick mirrored/a 1.png";
import frontMirrorKick2 from "../../assets/others/GameAsset/blastimpulse/front kick mirrored/a 2.png";
import frontMirrorKick3 from "../../assets/others/GameAsset/blastimpulse/front kick mirrored/a 3.png";

import frontLeftKick1 from "../../assets/others/GameAsset/blastimpulse/low kick mirrored/1.png";
import frontLeftKick2 from "../../assets/others/GameAsset/blastimpulse/low kick mirrored/2.png";
import frontLeftKick3 from "../../assets/others/GameAsset/blastimpulse/low kick mirrored/3.png";

import leftLowKick1 from "../../assets/others/GameAsset/blastimpulse/low kick mirrored/1.png";
import leftLowKick2 from "../../assets/others/GameAsset/blastimpulse/low kick mirrored/2.png";
import leftLowKick3 from "../../assets/others/GameAsset/blastimpulse/low kick mirrored/3.png";
import leftLowKick4 from "../../assets/others/GameAsset/blastimpulse/low kick mirrored/4.png";

class Hero {
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
  private idleImages: HTMLImageElement[];
  private walkRightImages: HTMLImageElement[];
  private walkLeftImages: HTMLImageElement[];
  private jumpImage: HTMLImageElement;
  private rightLowKickImages: HTMLImageElement[];
  private rightFrontKickImages: HTMLImageElement[];
  private leftFrontKickImages: HTMLImageElement[];
  private idleMirrorImages: HTMLImageElement[];
  private frontMirrorKickImages: HTMLImageElement[];
  private leftLowKickImages: HTMLImageElement[];
  private currentSpriteIndex: number;
  private state: string;
  private health: number;
  private canMove: boolean;
  private damage: number;
  collisionBox: { x: number; y: number; width: number; height: number };

  constructor(
    heroX: number,
    heroY: number,
    heroWidth: number,
    heroHeight: number,
    spriteImages: string[] = [idle1, idle2, idle3, idle4, idle5, idle6],
    walkRightImages: string[] = [walk1, walk2, walk3],
    walkLeftImages: string[] = [walkmLeft1, walkmLeft2, walkmLeft3],
    jumpImage: string = jump,
    rightLowKickImages: string[] = [lowkick1, lowkick2, lowkick3, lowkick4],
    rightFrontKickImages: string[] = [frontkickf1, frontkickf2, frontkickf3],
    leftFrontKickImages: string[] = [
      frontLeftKick1,
      frontLeftKick2,
      frontLeftKick3,
    ],
    idleMirrorImages: string[] = [
      idleMirror1,
      idleMirror2,
      idleMirror3,
      idleMirror4,
      idleMirror5,
      idleMirror6,
    ],
    frontMirrorKickImages: string[] = [
      frontMirrorKick1,
      frontMirrorKick2,
      frontMirrorKick3,
    ],
    leftLowKickImages: string[] = [
      leftLowKick1,
      leftLowKick2,
      leftLowKick3,
      leftLowKick4,
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
    this.idleImages = spriteImages.map((src) => {
      const spriteImage = new Image();
      spriteImage.src = src;
      return spriteImage;
    });
    this.walkRightImages = walkRightImages.map((src) => {
      const spriteImage = new Image();
      spriteImage.src = src;
      return spriteImage;
    });
    this.walkLeftImages = walkLeftImages.map((src) => {
      const spriteImage = new Image();
      spriteImage.src = src;
      return spriteImage;
    });
    this.jumpImage = new Image();
    this.jumpImage.src = jumpImage;
    this.rightLowKickImages = rightLowKickImages.map((src) => {
      const spriteImage = new Image();
      spriteImage.src = src;
      return spriteImage;
    });
    this.rightFrontKickImages = rightFrontKickImages.map((src) => {
      const spriteImage = new Image();
      spriteImage.src = src;
      return spriteImage;
    });
    this.leftFrontKickImages = leftFrontKickImages.map((src) => {
      const spriteImage = new Image();
      spriteImage.src = src;
      return spriteImage;
    });
    this.idleMirrorImages = idleMirrorImages.map((src) => {
      const spriteImage = new Image();
      spriteImage.src = src;
      return spriteImage;
    });
    this.frontMirrorKickImages = frontMirrorKickImages.map((src) => {
      const spriteImage = new Image();
      spriteImage.src = src;
      return spriteImage;
    });
    this.leftLowKickImages = leftLowKickImages.map((src) => {
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
        case "right":
          return this.walkRightImages;
        case "left":
          return this.walkLeftImages;
        case "jump":
          return [this.jumpImage];
        case "rightLowKick":
          return this.rightLowKickImages;
        case "rightFrontKick":
          return this.rightFrontKickImages;
        case "leftFrontKick":
          return this.leftFrontKickImages;
        case "idleMirror":
          return this.idleImages;
        case "rightFrontMirrorKick":
          return this.frontMirrorKickImages;
        case "leftLowKick":
          return this.leftLowKickImages;
        default:
          return this.idleMirrorImages;
      }
    }
    switch (this.state) {
      default:
        return this.idleImages;
    }
  }

  private animateSprite(ctx: CanvasRenderingContext2D): void {
    const currentFrame = this.getSpriteImages();
    let currentImage = currentFrame[this.currentSpriteIndex];

    currentImage = currentFrame[Math.floor(this.currentSpriteIndex / 15)];
    this.currentSpriteIndex =
      (this.currentSpriteIndex + 1) % (currentFrame.length * 15);
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

  getHeroWidth(): number {
    return this.heroWidth;
  }

  setHeroWidth(width: number): void {
    this.heroWidth = width;
  }

  getHeroHeight(): number {
    return this.heroHeight;
  }

  setHeroHeight(height: number): void {
    this.heroHeight = height;
  }

  getHeroX(): number {
    return this.heroX;
  }

  setHeroX(x: number): void {
    this.heroX = x;
  }

  getHeroY(): number {
    return this.heroY;
  }

  setHeroY(y: number): void {
    this.heroY = y;
  }

  getIdleImage(): HTMLImageElement[] {
    return this.idleImages;
  }

  setIdleimage(image: HTMLImageElement[]): void {
    this.idleImages = image;
  }

  getCurrentSpriteIndex(): number {
    return this.currentSpriteIndex;
  }

  setCurrentSpriteIndex(index: number): void {
    this.currentSpriteIndex = index;
  }

  getState(): string {
    return this.state;
  }

  setState(state: string): void {
    this.state = state;
  }

  getHealth(): number {
    return this.health;
  }

  setHealth(health: number): void {
    this.health = health;
  }

  getCanMove(): boolean {
    return this.canMove;
  }

  setCanMove(canMove: boolean): void {
    this.canMove = canMove;
  }

  getDamage(): number {
    return this.damage;
  }

  setDamage(damage: number): void {
    this.damage = damage;
  }
}

export default Hero;

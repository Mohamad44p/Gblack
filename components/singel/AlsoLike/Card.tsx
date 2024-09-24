import { forwardRef, ForwardedRef } from "react";
import Image from "next/image";

interface CardProps {
  id: string;
  frontSrc: string;
  frontAlt: string;
  backText: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ id, frontSrc, frontAlt, backText }, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div className="card" id={id} ref={ref}>
        <div className="card-wrapper">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <Image
                priority
                src={frontSrc}
                width={500}
                height={500}
                alt={frontAlt}
                className="img"
              />
            </div>
            <div className="flip-card-back">
              <p>{backText}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;

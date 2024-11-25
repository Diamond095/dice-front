import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  Ref,
} from "react";
import { OpponentDice } from "../../shared/ui/OpponentDice";
import "./OpponentDiceTurn.scss";
import useGameStore from "../../app/stores/gameStore";

// Указываем тип для рефа
const OpponentDiceTurn = forwardRef<{ throwDice: () => void }, unknown>(
  (props, ref) => {
    const diceRef1 = useRef<{
      rollDice: () => void;
      getResult: () => number | null;
    }>(null);
    const diceRef2 = useRef<{
      rollDice: () => void;
      getResult: () => number | null;
    }>(null);
    const [showDice, setShowDice] = useState<boolean>(false);
    const [resetDice, setResetDice] = useState<boolean>(false);
    const [opponentFirstDice, opponentSecondDice] = useGameStore((state) => [
      state.opponentFirstDice,
      state.opponentSecondDice,
    ]);

    const rollDice = async () => {
      const rollDice = (
        ref: React.RefObject<{
          rollDice: () => void;
          getResult: () => number | null;
        }>
      ) =>
        new Promise<number>((resolve) => {
          ref.current?.rollDice();
          const interval = setInterval(() => {
            if (!ref.current) return;
            const result = ref.current.getResult();
            if (result !== null) {
              clearInterval(interval);
              resolve(result);
            }
          }, 100);
        });

      const [result1, result2] = await Promise.all([
        rollDice(diceRef1),
        rollDice(diceRef2),
      ]);
    };

    useImperativeHandle(ref, () => ({
      throwDice: () => {
        if (diceRef1.current && diceRef2.current) {
          setShowDice(false);
          setResetDice(true);

          setTimeout(() => {
            setResetDice(false);
            setShowDice(true);
            rollDice();
          }, 500);
        }
      },
    }));

    return (
      <div
        className={`OpponentDiceContainer ${showDice ? "show" : ""} ${
          resetDice ? "reset" : ""
        }`}
      >
        <OpponentDice ref={diceRef1} targetFace={opponentFirstDice} />
        <OpponentDice ref={diceRef2} targetFace={opponentSecondDice} />
      </div>
    );
  }
);

export default OpponentDiceTurn;
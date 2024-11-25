import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  Ref,
} from "react";
import { MyDice } from "../../shared/ui/MyDice";
import useGameStore from "../../app/stores/gameStore";
import "./MyDiceTurn.scss";

// Define the interface for the ref object that will be exposed to the parent component
interface MyDiceTurnRef {
  throwDice: () => void;
}

// Component definition
const MyDiceTurn = forwardRef<MyDiceTurnRef>((_, ref) => {
  // Refs for individual dice
  const diceRef1 = useRef<{
    rollDice: () => void;
    getResult: () => number | null;
  }>(null);

  const diceRef2 = useRef<{
    rollDice: () => void;
    getResult: () => number | null;
  }>(null);

  // State variables
  const [showDice, setShowDice] = useState<boolean>(false);
  const [resetDice, setResetDice] = useState<boolean>(false);

  // Extract dice results from the store
  const [myFirstDice, mySecondDice] = useGameStore((state) => [
    state.myFirstDice,
    state.mySecondDice,
  ]);

  // Function to roll the dice and wait for the results
  const rollDice = async () => {
    const rollSingleDice = (
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

    // Roll both dice simultaneously
    const [result1, result2] = await Promise.all([
      rollSingleDice(diceRef1),
      rollSingleDice(diceRef2),
    ]);

    // Log the results for debugging
    console.log("Roll results:", result1, result2);
  };

  // Use useImperativeHandle to expose the throwDice method to the parent component
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
      className={`MyDiceContainer ${showDice ? "show" : ""} ${
        resetDice ? "reset" : ""
      }`}
    >
      <MyDice ref={diceRef1} targetFace={myFirstDice} />
      <MyDice ref={diceRef2} targetFace={mySecondDice} />
    </div>
  );
});

export default MyDiceTurn;

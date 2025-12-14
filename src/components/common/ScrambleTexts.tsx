import { ScrambleTextItem } from './ScrambleTextItem';

interface Props {
  sentences: string[];
  index: number;
  classNames?: string[];
}

export const ScrambleTexts = ({ sentences, index, classNames = [] }: Props) => {
  return (
    <>
      {sentences.map((text, i) => (
        <ScrambleTextItem
          key={i}
          text={text}
          show={i === index}
          className={classNames[index] ?? ''}
        />
      ))}
    </>
  );
};

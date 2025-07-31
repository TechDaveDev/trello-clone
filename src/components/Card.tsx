import { Draggable } from '@hello-pangea/dnd';
import { CardType } from '@/app/page';

type CardProps = {
  card: CardType;
  index: number;
};

const Card = ({ card, index }: CardProps) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="bg-white p-2 mb-2 rounded shadow-sm"
        >
          {card.text}
        </div>
      )}
    </Draggable>
  );
};

export default Card;
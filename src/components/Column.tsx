import Card from './Card';
import { Droppable } from '@hello-pangea/dnd';
import { ColumnType } from '@/app/page';

type ColumnProps = {
  column: ColumnType;
};

const Column = ({ column }: ColumnProps) => {
  return (
    <div className="bg-gray-100 p-3 rounded-lg w-72 flex-shrink-0">
      <h2 className="font-bold mb-3 text-lg">{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="min-h-[100px]"
          >
            {column.cards.map((card, index) => (
              <Card key={card.id} card={card} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
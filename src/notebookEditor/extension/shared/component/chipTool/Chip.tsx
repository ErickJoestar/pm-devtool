import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Identifier } from 'dnd-core';

import { CHIP_CLASS, CHIP_CLOSE_BUTTON_CLASS } from 'notebookEditor/theme/theme';

// ********************************************************************************
// == Constant ====================================================================
// -- Type ------------------------------------------------------------------------
export type ChipDraggableItem = { id: string; index: number; }
const chipObjectType = { CHIP: 'chip' };

// == Component ===================================================================
interface Props {
  id: string;
  text: string;
  index: number;
  moveChip: (dragIndex: number, hoverIndex: number) => void;
  dropCallback: (item: ChipDraggableItem) => void;
  chipCloseButtonCallback: (deletedIndex: number) => void;
}
export const Chip: React.FC<Props> = ({ id, text, index, moveChip, dropCallback, chipCloseButtonCallback }) => {
  const ref = useRef<HTMLDivElement>(null);

  // == Drag ======================================================================
  const [{ isDragging }, drag] = useDrag({
    type: chipObjectType.CHIP,
    item: (): ChipDraggableItem => { return { id, index }; },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  // == Drop ======================================================================
  const [{ handlerId }, drop] = useDrop<ChipDraggableItem, ChipDraggableItem, { handlerId: Identifier | null; }>({
    accept: chipObjectType.CHIP,
    collect(monitor) { return { handlerId: monitor.getHandlerId() }; },

    hover(item: ChipDraggableItem, monitor) {
      if(!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if(dragIndex === hoverIndex) return/*same index*/;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get horizontal middle
      const xMiddleOfBoundingRect = Math.ceil((hoverBoundingRect.right - hoverBoundingRect.left) / 2);

      const clientOffset = monitor.getClientOffset();
      if(!clientOffset) return;

      // Get pixels from current pos to the left
      const distanceToLeftSide = clientOffset.x - hoverBoundingRect.left;

      // When dragging to the left, only move when distance to the left is less than the middle
      if(dragIndex < hoverIndex && xMiddleOfBoundingRect > distanceToLeftSide) return;

      // When dragging to the right, only move when distance to the left is bigger than the middle
      if(dragIndex > hoverIndex && xMiddleOfBoundingRect < distanceToLeftSide) return;

      // Move the chip
      moveChip(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },

    drop(item) {
      dropCallback(item);
      return item;
    },
  });

  // == Setup =====================================================================
  drag(drop(ref));

  // == UI ========================================================================
  const opacity = isDragging ? 0 : 1;
  return (
    <div ref={ref} className={CHIP_CLASS} style={{ opacity }} data-handler-id={handlerId}>
      {text}
      <span className={CHIP_CLOSE_BUTTON_CLASS} tabIndex={0/* (SEE: notebookEditor/toolbar/type) */} onClick={() => chipCloseButtonCallback(index)}>&times;</span>
    </div>
  );
};

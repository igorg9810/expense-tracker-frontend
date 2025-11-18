import type { Meta, StoryObj } from '@storybook/react-vite';
import DraggableExpenseRow from './DraggableExpenseRow';
import type { Expense } from '../../utils/api/expenseService';
import './DraggableExpenseRow.module.css';

const meta = {
  title: 'Components/DraggableExpenseRow',
  component: DraggableExpenseRow,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ background: '#1f2937', padding: '20px', minHeight: '400px' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: '#2d3748',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <thead style={{ background: '#374151' }}>
            <tr>
              <th
                style={{ padding: '16px 12px', textAlign: 'left', color: '#ffffff', width: '50px' }}
              >
                Drag
              </th>
              <th style={{ padding: '16px 12px', textAlign: 'left', color: '#ffffff' }}>Name</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', color: '#ffffff' }}>Amount</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', color: '#ffffff' }}>
                Category
              </th>
              <th style={{ padding: '16px 12px', textAlign: 'left', color: '#ffffff' }}>Date</th>
              <th
                style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  color: '#ffffff',
                  width: '80px',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <Story />
          </tbody>
        </table>
      </div>
    ),
  ],
  argTypes: {
    expense: {
      description: 'The expense object to display',
    },
    index: {
      control: 'number',
      description: 'The index of the expense in the list',
    },
    isDragging: {
      control: 'boolean',
      description: 'Whether this row is currently being dragged',
    },
    isOver: {
      control: 'boolean',
      description: 'Whether another row is being dragged over this one',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
  },
  args: {
    onDragStart: () => {},
    onDragEnd: () => {},
    onDragOver: () => {},
    onDragLeave: () => {},
    onDrop: () => {},
  },
} satisfies Meta<typeof DraggableExpenseRow>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleExpense: Expense = {
  id: 1,
  name: 'Office Supplies',
  amount: 150.5,
  currency: 'USD',
  category: 'Office',
  date: '2024-01-15',
  userId: 1,
  displayOrder: 0,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
};

export const Default: Story = {
  args: {
    expense: sampleExpense,
    index: 0,
    isDragging: false,
    isOver: false,
  },
};

export const Dragging: Story = {
  args: {
    expense: sampleExpense,
    index: 0,
    isDragging: true,
    isOver: false,
  },
};

export const DragOver: Story = {
  args: {
    expense: sampleExpense,
    index: 0,
    isDragging: false,
    isOver: true,
  },
};

export const MultipleRows: Story = {
  decorators: [
    () => (
      <div style={{ background: '#1f2937', padding: '20px', minHeight: '400px' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: '#2d3748',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <thead style={{ background: '#374151' }}>
            <tr>
              <th
                style={{ padding: '16px 12px', textAlign: 'left', color: '#ffffff', width: '50px' }}
              >
                Drag
              </th>
              <th style={{ padding: '16px 12px', textAlign: 'left', color: '#ffffff' }}>Name</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', color: '#ffffff' }}>Amount</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', color: '#ffffff' }}>
                Category
              </th>
              <th style={{ padding: '16px 12px', textAlign: 'left', color: '#ffffff' }}>Date</th>
              <th
                style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  color: '#ffffff',
                  width: '80px',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <DraggableExpenseRow
              expense={{
                ...sampleExpense,
                id: 1,
                name: 'Office Supplies',
                amount: 150.5,
                category: 'Office',
              }}
              index={0}
              isDragging={false}
              isOver={false}
              onDragStart={() => {}}
              onDragEnd={() => {}}
              onDragOver={() => {}}
              onDragLeave={() => {}}
              onDrop={() => {}}
            />
            <DraggableExpenseRow
              expense={{
                ...sampleExpense,
                id: 2,
                name: 'Team Lunch',
                amount: 250.0,
                category: 'Food',
                date: '2024-01-16',
              }}
              index={1}
              isDragging={true}
              isOver={false}
              onDragStart={() => {}}
              onDragEnd={() => {}}
              onDragOver={() => {}}
              onDragLeave={() => {}}
              onDrop={() => {}}
            />
            <DraggableExpenseRow
              expense={{
                ...sampleExpense,
                id: 3,
                name: 'Software License',
                amount: 499.0,
                category: 'Software',
                date: '2024-01-17',
              }}
              index={2}
              isDragging={false}
              isOver={true}
              onDragStart={() => {}}
              onDragEnd={() => {}}
              onDragOver={() => {}}
              onDragLeave={() => {}}
              onDrop={() => {}}
            />
            <DraggableExpenseRow
              expense={{
                ...sampleExpense,
                id: 4,
                name: 'Conference Ticket',
                amount: 899.0,
                category: 'Events',
                date: '2024-01-18',
              }}
              index={3}
              isDragging={false}
              isOver={false}
              onDragStart={() => {}}
              onDragEnd={() => {}}
              onDragOver={() => {}}
              onDragLeave={() => {}}
              onDrop={() => {}}
            />
          </tbody>
        </table>
      </div>
    ),
  ],
  args: {
    expense: sampleExpense,
    index: 0,
    isDragging: false,
    isOver: false,
  },
};

export const EuroExpense: Story = {
  args: {
    expense: {
      ...sampleExpense,
      amount: 200.75,
      currency: 'EUR',
    },
    index: 0,
    isDragging: false,
    isOver: false,
  },
};

export const LargeAmount: Story = {
  args: {
    expense: {
      ...sampleExpense,
      name: 'Annual Marketing Budget',
      amount: 1234567.89,
      category: 'Marketing',
    },
    index: 0,
    isDragging: false,
    isOver: false,
  },
};

export const LongName: Story = {
  args: {
    expense: {
      ...sampleExpense,
      name: 'Very Long Expense Name That Demonstrates How The Component Handles Extended Text Content',
      amount: 99.99,
      category: 'Miscellaneous',
    },
    index: 0,
    isDragging: false,
    isOver: false,
  },
};

export const DifferentCategories: Story = {
  decorators: [
    () => (
      <div style={{ background: '#1f2937', padding: '20px', minHeight: '400px' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: '#2d3748',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <thead style={{ background: '#374151' }}>
            <tr>
              <th
                style={{ padding: '16px 12px', textAlign: 'left', color: '#ffffff', width: '50px' }}
              >
                Drag
              </th>
              <th style={{ padding: '16px 12px', textAlign: 'left', color: '#ffffff' }}>Name</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', color: '#ffffff' }}>Amount</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', color: '#ffffff' }}>
                Category
              </th>
              <th style={{ padding: '16px 12px', textAlign: 'left', color: '#ffffff' }}>Date</th>
              <th
                style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  color: '#ffffff',
                  width: '80px',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {['Office', 'Food', 'Software', 'Events', 'Marketing', 'Travel'].map(
              (category, index) => (
                <DraggableExpenseRow
                  key={index}
                  expense={{
                    ...sampleExpense,
                    id: index + 1,
                    name: `${category} Expense`,
                    category,
                    amount: Math.floor(Math.random() * 1000) + 50,
                    date: `2024-01-${String(15 + index).padStart(2, '0')}`,
                  }}
                  index={index}
                  isDragging={false}
                  isOver={false}
                  onDragStart={() => {}}
                  onDragEnd={() => {}}
                  onDragOver={() => {}}
                  onDragLeave={() => {}}
                  onDrop={() => {}}
                />
              ),
            )}
          </tbody>
        </table>
      </div>
    ),
  ],
  args: {
    expense: sampleExpense,
    index: 0,
    isDragging: false,
    isOver: false,
  },
};

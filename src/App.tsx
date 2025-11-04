import React, { useState } from 'react';
import Button from './components/Button/Button';
import InputLabel from './components/InputLabel/InputLabel';
import Input from './components/Input/Input';
import Icon from './components/Icon/Icon';
import { type IconName } from './assets/icons';
import DatePicker from './components/DatePicker/DatePicker';
import Loader from './components/Loader/Loader';
import Logo from './components/Logo/Logo';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
    date: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState('plus');

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Expense submitted successfully!');
    }, 2000);
  };

  const handleIconClick = (iconName: IconName) => {
    setSelectedIcon(iconName);
    setFormData((prev) => ({ ...prev, category: iconName }));
  };

  const iconNames: IconName[] = [
    'bell',
    'bank',
    'camera',
    'receipt',
    'coins',
    'mobile',
    'usb',
    'credit-card-plus',
    'water-drop',
    'paypal',
    'plus',
    'close',
    'search',
    'edit',
    'trash',
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#1f2937',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header with Logo */}
      <header
        style={{
          padding: '20px',
          borderBottom: '1px solid #374151',
          backgroundColor: '#111827',
        }}
      >
        <Logo />
      </header>

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1
          style={{
            color: '#ffffff',
            marginBottom: '30px',
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        >
          Expense Tracker Component Library
        </h1>

        {/* Button Component Demo */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '1.5rem' }}>
            Button Component
          </h2>

          <div
            style={{
              backgroundColor: '#000000',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #374151',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '10px' }}>Variants</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '15px' }}>
                <Button variant="primary" onClick={() => setClickCount((prev) => prev + 1)}>
                  Primary
                </Button>
                <Button variant="secondary" onClick={() => setClickCount((prev) => prev + 1)}>
                  Secondary
                </Button>
                <Button variant="outlined" onClick={() => setClickCount((prev) => prev + 1)}>
                  Outlined
                </Button>
                <Button
                  variant="close"
                  aria-label="Close"
                  onClick={() => setClickCount((prev) => prev + 1)}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '10px' }}>Sizes</h3>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '15px',
                }}
              >
                <Button size="small">Small</Button>
                <Button size="medium">Medium</Button>
                <Button size="large">Large</Button>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '10px' }}>States</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '15px' }}>
                <Button disabled>Disabled</Button>
                <Button loading={loading} onClick={handleSubmit}>
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
                <Button active>Active</Button>
              </div>
            </div>

            <div style={{ fontSize: '14px', color: '#9ca3af' }}>Button clicks: {clickCount}</div>
          </div>
        </section>

        {/* InputLabel Component Demo */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '1.5rem' }}>
            InputLabel Component
          </h2>

          <div
            style={{
              backgroundColor: '#000000',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #374151',
            }}
          >
            <div style={{ marginBottom: '15px' }}>
              <InputLabel>Basic Label</InputLabel>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <InputLabel htmlFor="demo-input">Label with htmlFor</InputLabel>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <InputLabel required>Required Field</InputLabel>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <InputLabel variant="optional">Optional Field</InputLabel>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <InputLabel disabled>Disabled Label</InputLabel>
            </div>
          </div>
        </section>

        {/* Input Component Demo */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '1.5rem' }}>
            Input Component
          </h2>

          <div
            style={{
              backgroundColor: '#000000',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #374151',
            }}
          >
            <div style={{ marginBottom: '15px' }}>
              <Input placeholder="Basic text input" />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <Input type="email" placeholder="Email input" />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <Input type="password" placeholder="Password input" />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <Input type="number" placeholder="Number input" />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <Input error helperText="This field has an error" />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <Input success successMessage="This field is valid" />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <Input disabled placeholder="Disabled input" />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <Input readOnly defaultValue="Read-only input" />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <Input
                startIcon={<Icon iconName="search" size="small" />}
                placeholder="Search with icon"
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <Input
                endIcon={<Icon iconName="close" size="small" />}
                placeholder="Input with end icon"
              />
            </div>
          </div>
        </section>

        {/* Icon Component Demo */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '1.5rem' }}>
            Icon Component
          </h2>

          <div
            style={{
              backgroundColor: '#000000',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #374151',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '10px' }}>
                Basic Icons
              </h3>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <Icon iconName="plus" />
                <Icon iconName="close" />
                <Icon iconName="search" />
                <Icon iconName="edit" />
                <Icon iconName="trash" />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '10px' }}>
                Different Sizes
              </h3>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Icon iconName="plus" size="small" />
                <Icon iconName="plus" size="medium" />
                <Icon iconName="plus" size="large" />
                <Icon iconName="plus" size={32} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '10px' }}>
                Different Colors
              </h3>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Icon iconName="plus" color="default" />
                <Icon iconName="plus" color="primary" />
                <Icon iconName="plus" color="error" />
                <Icon iconName="plus" color="success" />
                <Icon iconName="plus" color="warning" />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '10px' }}>
                Clickable Icons
              </h3>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <Icon
                  iconName="plus"
                  onClick={() => alert('Plus clicked!')}
                  aria-label="Add new item"
                />
                <Icon
                  iconName="edit"
                  onClick={() => alert('Edit clicked!')}
                  aria-label="Edit item"
                />
                <Icon
                  iconName="trash"
                  onClick={() => alert('Delete clicked!')}
                  aria-label="Delete item"
                  color="error"
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '10px' }}>
                Expense Categories
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '15px',
                  padding: '15px',
                  backgroundColor: '#111827',
                  borderRadius: '4px',
                }}
              >
                {iconNames.slice(0, 10).map((iconName) => (
                  <div
                    key={iconName}
                    style={{
                      textAlign: 'center',
                      padding: '10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      backgroundColor: selectedIcon === iconName ? '#5832D8' : 'transparent',
                      transition: 'background-color 0.2s',
                    }}
                    onClick={() => handleIconClick(iconName)}
                  >
                    <Icon
                      iconName={iconName}
                      size="large"
                      color={selectedIcon === iconName ? 'white' : 'default'}
                    />
                    <div
                      style={{
                        fontSize: '12px',
                        marginTop: '5px',
                        textTransform: 'capitalize',
                      }}
                    >
                      {iconName.replace('-', ' ')}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '10px', fontSize: '14px', color: '#9ca3af' }}>
                Selected category: {selectedIcon}
              </div>
            </div>
          </div>
        </section>

        {/* DatePicker Component Demo */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '1.5rem' }}>
            DatePicker Component
          </h2>

          <div
            style={{
              backgroundColor: '#000000',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #374151',
            }}
          >
            <div style={{ marginBottom: '15px' }}>
              <DatePicker />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <DatePicker placeholder="Select date" />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <DatePicker error helperText="Please select a valid date" />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <DatePicker success successMessage="Date selected successfully" />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <DatePicker min="2023-01-01" max="2023-12-31" helperText="Select date within 2023" />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <DatePicker disabled />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <DatePicker
                startIcon={<Icon iconName="edit" size="small" />}
                placeholder="Date with icon"
              />
            </div>
          </div>
        </section>

        {/* Loader Component Demo */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '1.5rem' }}>
            Loader Component
          </h2>

          <div
            style={{
              backgroundColor: '#000000',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #374151',
            }}
          >
            <div style={{ marginBottom: '15px' }}>
              <Loader />
            </div>
          </div>
        </section>

        {/* Complete Form Example */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#ffffff', marginBottom: '20px', fontSize: '1.5rem' }}>
            Complete Expense Form Example
          </h2>

          <div
            style={{
              backgroundColor: '#000000',
              padding: '30px',
              borderRadius: '8px',
              border: '1px solid #374151',
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div style={{ marginBottom: '20px' }}>
                <InputLabel htmlFor="expense-name" required>
                  Expense Name
                </InputLabel>
                <Input
                  id="expense-name"
                  placeholder="Enter expense name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <InputLabel htmlFor="expense-email">Email (Optional)</InputLabel>
                <Input
                  id="expense-email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <InputLabel htmlFor="expense-amount" required>
                  Amount
                </InputLabel>
                <Input
                  id="expense-amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleInputChange('amount')}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <InputLabel htmlFor="expense-date" required>
                  Date
                </InputLabel>
                <DatePicker
                  id="expense-date"
                  value={formData.date}
                  onChange={handleInputChange('date')}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <InputLabel>Category</InputLabel>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '10px',
                    marginTop: '10px',
                  }}
                >
                  {iconNames.slice(0, 10).map((iconName) => (
                    <div
                      key={iconName}
                      style={{
                        textAlign: 'center',
                        padding: '10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundColor: selectedIcon === iconName ? '#5832D8' : '#111827',
                        transition: 'background-color 0.2s',
                      }}
                      onClick={() => handleIconClick(iconName)}
                    >
                      <Icon
                        iconName={iconName}
                        size="medium"
                        color={selectedIcon === iconName ? 'white' : 'default'}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                <Button type="submit" variant="primary" loading={loading} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Expense'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    setFormData({ name: '', email: '', amount: '', date: '', category: '' })
                  }
                >
                  Clear Form
                </Button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;

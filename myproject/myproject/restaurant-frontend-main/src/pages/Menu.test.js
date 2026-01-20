import { render, screen, fireEvent } from '@testing-library/react';
import Menu from './Menu';
import { MenuContext } from '../context/MenuContext';
import { CartContext } from '../context/CartContext';
import { act } from 'react';


jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    },
}));

jest.mock('react-router-dom', () => ({
    useLocation: () => ({ state: null }),
    useNavigate: () => jest.fn(),
}));

const mockMenuItems = [
    {
        item_id: 1,
        name: 'Burger',
        category: 'Burgers',
        description: 'Tasty burger',
        price: 100,
        image_url: 'burger.jpg',
    },
    {
        item_id: 2,
        name: 'Pizza',
        category: 'Pizza',
        description: 'Cheesy pizza',
        price: 200,
        image_url: 'pizza.jpg',
    },
];

const mockAddToCart = jest.fn();

const renderMenu = () => {
    return render(
        <MenuContext.Provider value={{ menuItems: mockMenuItems }}>
            <CartContext.Provider value={{ addToCart: mockAddToCart }}>
                <Menu />
            </CartContext.Provider>
        </MenuContext.Provider>
    );
};

test('renders menu items and filters by category', () => {
    renderMenu();

    
    expect(screen.getByRole('heading', { name: 'Burger' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pizza' })).toBeInTheDocument();

    
    const burgerButton = screen.getByRole('button', { name: 'Burgers' });
    fireEvent.click(burgerButton);

    expect(screen.getByRole('heading', { name: 'Burger' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Pizza' })).not.toBeInTheDocument();

    
    const pizzaButton = screen.getByRole('button', { name: 'Pizza' });
    fireEvent.click(pizzaButton);

    expect(screen.queryByRole('heading', { name: 'Burger' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pizza' })).toBeInTheDocument();

    
    const allButton = screen.getByRole('button', { name: 'All' });
    fireEvent.click(allButton);

    expect(screen.getByRole('heading', { name: 'Burger' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pizza' })).toBeInTheDocument();
});

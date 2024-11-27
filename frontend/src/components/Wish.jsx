import React from "react";
import { useNavigate } from 'react-router-dom';

export default function Wish({ wish }) {
    const imageUrl = `/uploads/${wish.product_photo}`;

    const navigate = useNavigate();

    const handleDelete = async (wishId) => {
        try {
            const response = await fetch('/api/delete-wish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ wish_id: wishId }),
                credentials: 'include',
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Wish deleted:', data.message);
                // Optionally, remove the wish from the UI after successful deletion
                window.location.reload();
            } else {
                throw new Error('Error deleting wish');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleEdit = (wishId) => {
        navigate(`/edit-wish/${wishId}`);
    };
    

    return (
        <div className="people-container">
            <div className="wish-image-container">
                <img className="wish-image" src={imageUrl} alt={wish.product_name} />
            </div>
            <h2 className="people-name">{wish.product_name}</h2>
            <div className="wish-info-text">
                <button onClick={() => handleEdit(wish.id)} className="view-people-button" type="button">
                    EDIT
                </button>
                <button className="delete-people-button" onClick={() => handleDelete(wish.id)} type="button">
                    DELETE
                </button>
            </div>
        </div>
    );
}

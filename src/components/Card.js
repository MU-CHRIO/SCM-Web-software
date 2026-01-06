import React from 'react';

export default function Card({ title, description, children }) {
    return (
        <div className="card">
            <div className="card-header">
                <h3>{title}</h3>
                {description && <p className="muted">{description}</p>}
            </div>
            <div className="card-body">{children}</div>
        </div>
    );
}
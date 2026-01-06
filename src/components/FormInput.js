import React from 'react';

export default function FormInput({ label, type = 'text', value, onChange, placeholder }) {
    return (
        <label className="form-group">
            <span className="form-label">{label}</span>
            <input className="form-input" type={type} value={value} onChange={onChange} placeholder={placeholder} />
        </label>
    );
}
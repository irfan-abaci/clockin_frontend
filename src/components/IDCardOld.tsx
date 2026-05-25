import React, { FC } from 'react';
import './IDCard.css'; 
import noImage from '../assets/img/Profile.jpg'
import urlMaker from '../helpers/UrlMaker';

interface IDCardProps {
    name:any;
    photo:any;
    designation:string;
    email:string;
    phone:string
}

const IDCard:FC<IDCardProps> = ({ name, photo, designation, email,phone }) => {

    return (
      <div className="id-card">
        <div className="id-card-header">
          <img src={photo ? urlMaker(photo,'avatars') : noImage} alt="Profile" className="id-card-photo" />
        </div>
        <div className="id-card-body">
          <h2>{name}</h2>
          <p>Designation: {designation}</p>
          <p>{email}</p>
          <p>{phone}</p>

        </div>
      </div>
    );
  };

export default IDCard
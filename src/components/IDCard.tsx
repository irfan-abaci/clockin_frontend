import React, { FC, useState } from 'react';
import './IDCard.css';
import noImage from '../assets/img.jpg'
import urlMaker from '../helpers/UrlMaker';


interface IDCardProps {
  name:any;
  photo:any;
  designation:string;
  // id:any;
  email:string;
  phone:string
}

const IDCardComponent:FC<IDCardProps> = ({ photo, name, designation, phone, email }) => {
 
  return (
    <div className="id-card" id='id-card-div'>
      <div className="id-card-header">
        <img src={photo ? urlMaker(photo,'avatars') : noImage} alt="Profile Picture" className="id-card-photo" />
      </div>
      <div className="id-card-body">
        <h2>{name}</h2>
        <p>Designation: {designation}</p>
        {/* <p>ID: {id}</p> */}
        <p>Phone: {phone}</p>
        <p>Email: {email}</p>
      </div>
    </div>
  );
};


export default IDCardComponent;

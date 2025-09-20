import React, { useState, useEffect } from 'react';
import Speedometer, { Background, Arc, Needle, Progress, Marks, Indicator } from 'react-speedometer';

const SpeedometerDashboard = () => {
  const [speed1, setSpeed1] = useState(120);
  const [speed2, setSpeed2] = useState(75);

  // Simulating data changes for testing
  useEffect(() => {
    const dummyDataInterval = setInterval(() => {
      setSpeed1(() => Math.floor(Math.random() * 180)); // Random speed between 0-180
      setSpeed2(() => Math.floor(Math.random() * 100)); // Random performance between 0-100
    }, 3000);

    return () => clearInterval(dummyDataInterval);
  }, []);

  // Keeping API fetch logic commented for future use
  /*
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('YOUR_API_ENDPOINT');
        const data = await response.json();
        setSpeed1(data.speed1);
        setSpeed2(data.speed2);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);
  */

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12 mb-4">
          <h2 className="text-center text-primary">Dashboard Metrics</h2>
        </div>
      </div>
      
      <div className="row justify-content-center align-items-center g-4">
        <div className="col-md-3 text-center">
          <h5 className="mb-3">Vehicle Speed</h5>
          <Speedometer
            value={speed1}
            max={180}
            angle={220}
            width={200}
            height={150}
            accentColor="#D1D1D1"
          >
            <Background 
            opacity={1}
            color="#2F2F34"
            borderWidth={10}
            />
            <Arc 
            color="#DA291C"
            />
            <Needle 
            color="#DA291C"
            />
            <Progress 
            color="#D1D1D1"
            />
            <Marks 
            color="#D1D1D1"
            />
            <Indicator>
              {(value, textProps) => (
                <text
                  {...textProps}
                  fontSize="16"
                  textAnchor="middle"
                >
                  {value} km/h
                </text>
              )}
            </Indicator>
          </Speedometer>
          <p className="mt-3 text-muted">Current Speed (km/h)</p>
        </div>

        <div className="col-md-3 text-center">
          <h5 className="mb-3">Performance</h5>
          <Speedometer
            value={speed2}
            max={100}
            angle={220}
            width={200}
            height={150}
            accentColor="#00ff00"
          >
            <Background />
            <Arc />
            <Needle />
            <Progress />
            <Marks />
            <Indicator>
              {(value, textProps) => (
                <text
                  {...textProps}
                  fontSize="16"
                  textAnchor="middle"
                >
                  {value}%
                </text>
              )}
            </Indicator>
          </Speedometer>
          <p className="mt-3 text-muted">System Performance</p>
        </div>

        <div className="col-md-3 text-center">
          <h5 className="mb-3">Fuel Efficiency</h5>
          <Speedometer
            value={Math.floor(Math.random() * 50)}
            max={50}
            angle={220}
            width={200}
            height={150}
            accentColor="#ff9900"
          >
            <Background />
            <Arc />
            <Needle />
            <Progress />
            <Marks />
            <Indicator>
              {(value, textProps) => (
                <text
                  {...textProps}
                  fontSize="16"
                  textAnchor="middle"
                >
                  {value} L/100km
                </text>
              )}
            </Indicator>
          </Speedometer>
          <p className="mt-3 text-muted">Fuel Efficiency</p>
        </div>

        <div className="col-md-3 text-center">
          <h5 className="mb-3">Battery Level</h5>
          <Speedometer
            value={Math.floor(Math.random() * 100)}
            max={100}
            angle={220}
            width={200}
            height={150}
            accentColor="#2F2F34"
          >
            <Background 
            color="#2F2F34"
            borderWidth={10}
            />
            <Arc
            color="#2F2F34"
            />
            <Needle 
            color="#2F2F34"
            />
            <Progress 
            color="#2F2F34"
            />
            <Marks 
            color="#2F2F34"
            />
            <Indicator
            color="#2F2F34"
            >
              
              {(value, textProps) => (
                <text
                  {...textProps}
                  fontSize="16"
                  textAnchor="middle"
                >
                  {value}%
                </text>
              )}
            </Indicator>
          </Speedometer>
          <p className="mt-3 text-muted">Battery Level</p>
        </div>
      </div>
    </div>
  );
};

export default SpeedometerDashboard;
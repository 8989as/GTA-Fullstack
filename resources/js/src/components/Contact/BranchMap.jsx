import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "./BranchMap.css";

const branches = [
  {
    id: 1,
    name: "فرع الرياض - الفيصلية",
    address: "الصناعات، الثقبة، الخبر 34626، المملكة العربية السعودية",
    phone: "013 845 7733",
    hours: "من السبت للخميس – 10 ص إلى 7 م",
    location: { lat: 24.7136, lng: 46.6753 }, // Riyadh coordinates
  },
  {
    id: 2,
    name: "فرع جدة - التحلية",
    address: "شارع التحلية، حي الأندلس، جدة 23432، المملكة العربية السعودية",
    phone: "012 234 5678",
    hours: "من السبت للخميس – 9 ص إلى 8 م",
    location: { lat: 21.5433, lng: 39.1728 }, // Jeddah coordinates
  },
  {
    id: 3,
    name: "فرع الدمام - الشاطئ",
    address: "حي الشاطئ، الدمام 32413، المملكة العربية السعودية",
    phone: "013 123 4567",
    hours: "من السبت للخميس – 10 ص إلى 9 م",
    location: { lat: 26.4207, lng: 50.0888 }, // Dammam coordinates
  },
];

const BranchMap = () => {
  const [selectedBranch, setSelectedBranch] = React.useState(branches[0]);

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const center = selectedBranch.location;

  return (
    <div className="container-fluid py-5" dir="rtl">
      <h2 className="branch-heading mb-4">فروعنا </h2>
      <div className="mb-4">
        <p className="branch-subheading">
          نخدمك وين ما كنت! أختر الفرع الأقرب لك وتواصل معنا مباشرة:
        </p>
      </div>

      <div className="row">
        {branches.map((branch) => (
          <div key={branch.id} className="col-md-4 mb-4">
            <div
              className={`branch-card ${
                selectedBranch.id === branch.id ? "shadow" : ""
              }`}
              onClick={() => setSelectedBranch(branch)}
            >
              <div className="p-4">
                <h3 className="branch-title fs-4 mb-3">{branch.name}</h3>

                <div className="d-flex justify-content-end align-items-start mb-2">
                  <div className="branch-info flex-grow-1 text-end">
                    {branch.address}
                  </div>
                  <div className="branch-icon" />
                </div>

                <div className="d-flex justify-content-end align-items-start mb-2">
                  <div className="branch-info flex-grow-1 text-end">
                    {branch.phone}
                  </div>
                  <div className="branch-icon" />
                </div>

                <div className="d-flex justify-content-end align-items-start">
                  <div className="branch-info flex-grow-1 text-end">
                    {branch.hours}
                  </div>
                  <div className="branch-icon" />
                </div>
              </div>

              <div className="map-container">
                <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={branch.location}
                    zoom={15}
                    options={{
                      mapTypeControl: false,
                      streetViewControl: false,
                      fullscreenControl: false,
                    }}
                  >
                    <Marker position={branch.location} />
                  </GoogleMap>
                </LoadScript>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchMap;

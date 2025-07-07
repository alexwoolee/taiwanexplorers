import { APIProvider, Map, type MapCameraChangedEvent } from '@vis.gl/react-google-maps';

const Regions = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  return (
    <div className='flex flex-col w-full justify-center items-center'>
      <h1>Map of Taipei</h1>
      <div className='flex'>
        <APIProvider apiKey={apiKey}>
          <Map 
            defaultZoom={13} 
            center={{ lat: 25.0330, lng: 121.5654 }}
            style={{ width: "500px", height: "500px"}}
            onCameraChanged={ (ev: MapCameraChangedEvent) =>
              console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
            }>  
          </Map>
        </APIProvider>
      </div>
    </div>
  )
};

export default Regions;
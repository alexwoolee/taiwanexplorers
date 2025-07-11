import {
  require_react_dom
} from "./chunk-QOVZGY7A.js";
import {
  __commonJS,
  __toESM,
  require_react
} from "./chunk-5WQJO2FO.js";

// node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "node_modules/fast-deep-equal/index.js"(exports, module) {
    "use strict";
    module.exports = function equal(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; )
            if (!equal(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// node_modules/@vis.gl/react-google-maps/dist/index.modern.mjs
var import_react = __toESM(require_react(), 1);
var import_react_dom = __toESM(require_react_dom(), 1);
var import_fast_deep_equal = __toESM(require_fast_deep_equal(), 1);
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
var APILoadingStatus = {
  NOT_LOADED: "NOT_LOADED",
  LOADING: "LOADING",
  LOADED: "LOADED",
  FAILED: "FAILED",
  AUTH_FAILURE: "AUTH_FAILURE"
};
var MAPS_API_BASE_URL = "https://maps.googleapis.com/maps/api/js";
var GoogleMapsApiLoader = class {
  /**
   * Loads the Maps JavaScript API with the specified parameters.
   * Since the Maps library can only be loaded once per page, this will
   * produce a warning when called multiple times with different
   * parameters.
   *
   * The returned promise resolves when loading completes
   * and rejects in case of an error or when the loading was aborted.
   */
  static async load(params, onLoadingStatusChange) {
    var _window$google;
    const libraries = params.libraries ? params.libraries.split(",") : [];
    const serializedParams = this.serializeParams(params);
    this.listeners.push(onLoadingStatusChange);
    if ((_window$google = window.google) != null && (_window$google = _window$google.maps) != null && _window$google.importLibrary) {
      if (!this.serializedApiParams) {
        this.loadingStatus = APILoadingStatus.LOADED;
      }
      this.notifyLoadingStatusListeners();
    } else {
      this.serializedApiParams = serializedParams;
      this.initImportLibrary(params);
    }
    if (this.serializedApiParams && this.serializedApiParams !== serializedParams) {
      console.warn(`[google-maps-api-loader] The maps API has already been loaded with different parameters and will not be loaded again. Refresh the page for new values to have effect.`);
    }
    const librariesToLoad = ["maps", ...libraries];
    await Promise.all(librariesToLoad.map((name) => google.maps.importLibrary(name)));
  }
  /**
   * Serialize the parameters used to load the library for easier comparison.
   */
  static serializeParams(params) {
    return [params.v, params.key, params.language, params.region, params.authReferrerPolicy, params.solutionChannel].join("/");
  }
  /**
   * Creates the global `google.maps.importLibrary` function for bootstrapping.
   * This is essentially a formatted version of the dynamic loading script
   * from the official documentation with some minor adjustments.
   *
   * The created importLibrary function will load the Google Maps JavaScript API,
   * which will then replace the `google.maps.importLibrary` function with the full
   * implementation.
   *
   * @see https://developers.google.com/maps/documentation/javascript/load-maps-js-api#dynamic-library-import
   */
  static initImportLibrary(params) {
    if (!window.google) window.google = {};
    if (!window.google.maps) window.google.maps = {};
    if (window.google.maps["importLibrary"]) {
      console.error("[google-maps-api-loader-internal]: initImportLibrary must only be called once");
      return;
    }
    let apiPromise = null;
    const loadApi = () => {
      if (apiPromise) return apiPromise;
      apiPromise = new Promise((resolve, reject) => {
        var _document$querySelect;
        const scriptElement = document.createElement("script");
        const urlParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          const urlParamName = key.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase());
          urlParams.set(urlParamName, String(value));
        }
        urlParams.set("loading", "async");
        urlParams.set("callback", "__googleMapsCallback__");
        scriptElement.async = true;
        scriptElement.src = MAPS_API_BASE_URL + `?` + urlParams.toString();
        scriptElement.nonce = ((_document$querySelect = document.querySelector("script[nonce]")) == null ? void 0 : _document$querySelect.nonce) || "";
        scriptElement.onerror = () => {
          this.loadingStatus = APILoadingStatus.FAILED;
          this.notifyLoadingStatusListeners();
          reject(new Error("The Google Maps JavaScript API could not load."));
        };
        window.__googleMapsCallback__ = () => {
          this.loadingStatus = APILoadingStatus.LOADED;
          this.notifyLoadingStatusListeners();
          resolve();
        };
        window.gm_authFailure = () => {
          this.loadingStatus = APILoadingStatus.AUTH_FAILURE;
          this.notifyLoadingStatusListeners();
        };
        this.loadingStatus = APILoadingStatus.LOADING;
        this.notifyLoadingStatusListeners();
        document.head.append(scriptElement);
      });
      return apiPromise;
    };
    google.maps.importLibrary = (libraryName) => loadApi().then(() => google.maps.importLibrary(libraryName));
  }
  /**
   * Calls all registered loadingStatusListeners after a status update.
   */
  static notifyLoadingStatusListeners() {
    for (const fn of this.listeners) {
      fn(this.loadingStatus);
    }
  }
};
GoogleMapsApiLoader.loadingStatus = APILoadingStatus.NOT_LOADED;
GoogleMapsApiLoader.serializedApiParams = void 0;
GoogleMapsApiLoader.listeners = [];
var _excluded$3 = ["onLoad", "onError", "apiKey", "version", "libraries"];
var _excluded2$1 = ["children"];
var DEFAULT_SOLUTION_CHANNEL = "GMP_visgl_rgmlibrary_v1_default";
var APIProviderContext = import_react.default.createContext(null);
function useMapInstances() {
  const [mapInstances, setMapInstances] = (0, import_react.useState)({});
  const addMapInstance = (mapInstance, id = "default") => {
    setMapInstances((instances) => _extends({}, instances, {
      [id]: mapInstance
    }));
  };
  const removeMapInstance = (id = "default") => {
    setMapInstances((_ref) => {
      let remaining = _objectWithoutPropertiesLoose(_ref, [id].map(_toPropertyKey));
      return remaining;
    });
  };
  const clearMapInstances = () => {
    setMapInstances({});
  };
  return {
    mapInstances,
    addMapInstance,
    removeMapInstance,
    clearMapInstances
  };
}
function useGoogleMapsApiLoader(props) {
  const {
    onLoad,
    onError,
    apiKey,
    version,
    libraries = []
  } = props, otherApiParams = _objectWithoutPropertiesLoose(props, _excluded$3);
  const [status, setStatus] = (0, import_react.useState)(GoogleMapsApiLoader.loadingStatus);
  const [loadedLibraries, addLoadedLibrary] = (0, import_react.useReducer)((loadedLibraries2, action) => {
    return loadedLibraries2[action.name] ? loadedLibraries2 : _extends({}, loadedLibraries2, {
      [action.name]: action.value
    });
  }, {});
  const librariesString = (0, import_react.useMemo)(() => libraries == null ? void 0 : libraries.join(","), [libraries]);
  const serializedParams = (0, import_react.useMemo)(() => JSON.stringify(_extends({
    apiKey,
    version
  }, otherApiParams)), [apiKey, version, otherApiParams]);
  const importLibrary = (0, import_react.useCallback)(async (name) => {
    var _google;
    if (loadedLibraries[name]) {
      return loadedLibraries[name];
    }
    if (!((_google = google) != null && (_google = _google.maps) != null && _google.importLibrary)) {
      throw new Error("[api-provider-internal] importLibrary was called before google.maps.importLibrary was defined.");
    }
    const res = await window.google.maps.importLibrary(name);
    addLoadedLibrary({
      name,
      value: res
    });
    return res;
  }, [loadedLibraries]);
  (0, import_react.useEffect)(
    () => {
      (async () => {
        try {
          const params = _extends({
            key: apiKey
          }, otherApiParams);
          if (version) params.v = version;
          if ((librariesString == null ? void 0 : librariesString.length) > 0) params.libraries = librariesString;
          if (params.channel === void 0 || params.channel < 0 || params.channel > 999) delete params.channel;
          if (params.solutionChannel === void 0) params.solutionChannel = DEFAULT_SOLUTION_CHANNEL;
          else if (params.solutionChannel === "") delete params.solutionChannel;
          await GoogleMapsApiLoader.load(params, (status2) => setStatus(status2));
          for (const name of ["core", "maps", ...libraries]) {
            await importLibrary(name);
          }
          if (onLoad) {
            onLoad();
          }
        } catch (error) {
          if (onError) {
            onError(error);
          } else {
            console.error("<ApiProvider> failed to load the Google Maps JavaScript API", error);
          }
        }
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiKey, librariesString, serializedParams]
  );
  return {
    status,
    loadedLibraries,
    importLibrary
  };
}
var APIProvider = (props) => {
  const {
    children
  } = props, loaderProps = _objectWithoutPropertiesLoose(props, _excluded2$1);
  const {
    mapInstances,
    addMapInstance,
    removeMapInstance,
    clearMapInstances
  } = useMapInstances();
  const {
    status,
    loadedLibraries,
    importLibrary
  } = useGoogleMapsApiLoader(loaderProps);
  const contextValue = (0, import_react.useMemo)(() => ({
    mapInstances,
    addMapInstance,
    removeMapInstance,
    clearMapInstances,
    status,
    loadedLibraries,
    importLibrary
  }), [mapInstances, addMapInstance, removeMapInstance, clearMapInstances, status, loadedLibraries, importLibrary]);
  return import_react.default.createElement(APIProviderContext.Provider, {
    value: contextValue
  }, children);
};
function useMapEvents(map, props) {
  for (const propName of eventPropNames) {
    const handler = props[propName];
    const eventType = propNameToEventType[propName];
    (0, import_react.useEffect)(() => {
      if (!map) return;
      if (!handler) return;
      const listener = google.maps.event.addListener(map, eventType, (ev) => {
        handler(createMapEvent(eventType, map, ev));
      });
      return () => listener.remove();
    }, [map, eventType, handler]);
  }
}
function createMapEvent(type, map, srcEvent) {
  const ev = {
    type,
    map,
    detail: {},
    stoppable: false,
    stop: () => {
    }
  };
  if (cameraEventTypes.includes(type)) {
    const camEvent = ev;
    const center = map.getCenter();
    const zoom = map.getZoom();
    const heading = map.getHeading() || 0;
    const tilt = map.getTilt() || 0;
    const bounds = map.getBounds();
    if (!center || !bounds || !Number.isFinite(zoom)) {
      console.warn("[createEvent] at least one of the values from the map returned undefined. This is not expected to happen. Please report an issue at https://github.com/visgl/react-google-maps/issues/new");
    }
    camEvent.detail = {
      center: (center == null ? void 0 : center.toJSON()) || {
        lat: 0,
        lng: 0
      },
      zoom: zoom || 0,
      heading,
      tilt,
      bounds: (bounds == null ? void 0 : bounds.toJSON()) || {
        north: 90,
        east: 180,
        south: -90,
        west: -180
      }
    };
    return camEvent;
  } else if (mouseEventTypes.includes(type)) {
    var _srcEvent$latLng;
    if (!srcEvent) throw new Error("[createEvent] mouse events must provide a srcEvent");
    const mouseEvent = ev;
    mouseEvent.domEvent = srcEvent.domEvent;
    mouseEvent.stoppable = true;
    mouseEvent.stop = () => srcEvent.stop();
    mouseEvent.detail = {
      latLng: ((_srcEvent$latLng = srcEvent.latLng) == null ? void 0 : _srcEvent$latLng.toJSON()) || null,
      placeId: srcEvent.placeId
    };
    return mouseEvent;
  }
  return ev;
}
var propNameToEventType = {
  onBoundsChanged: "bounds_changed",
  onCenterChanged: "center_changed",
  onClick: "click",
  onContextmenu: "contextmenu",
  onDblclick: "dblclick",
  onDrag: "drag",
  onDragend: "dragend",
  onDragstart: "dragstart",
  onHeadingChanged: "heading_changed",
  onIdle: "idle",
  onIsFractionalZoomEnabledChanged: "isfractionalzoomenabled_changed",
  onMapCapabilitiesChanged: "mapcapabilities_changed",
  onMapTypeIdChanged: "maptypeid_changed",
  onMousemove: "mousemove",
  onMouseout: "mouseout",
  onMouseover: "mouseover",
  onProjectionChanged: "projection_changed",
  onRenderingTypeChanged: "renderingtype_changed",
  onTilesLoaded: "tilesloaded",
  onTiltChanged: "tilt_changed",
  onZoomChanged: "zoom_changed",
  // note: onCameraChanged is an alias for the bounds_changed event,
  // since that is going to be fired in every situation where the camera is
  // updated.
  onCameraChanged: "bounds_changed"
};
var cameraEventTypes = ["bounds_changed", "center_changed", "heading_changed", "tilt_changed", "zoom_changed"];
var mouseEventTypes = ["click", "contextmenu", "dblclick", "mousemove", "mouseout", "mouseover"];
var eventPropNames = Object.keys(propNameToEventType);
function useMemoized(value, isEqual) {
  const ref = (0, import_react.useRef)(value);
  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
}
function useCustomCompareEffect(effect, dependencies, isEqual) {
  (0, import_react.useEffect)(effect, [useMemoized(dependencies, isEqual)]);
}
function useDeepCompareEffect(effect, dependencies) {
  useCustomCompareEffect(effect, dependencies, import_fast_deep_equal.default);
}
var mapOptionKeys = /* @__PURE__ */ new Set(["backgroundColor", "clickableIcons", "controlSize", "disableDefaultUI", "disableDoubleClickZoom", "draggable", "draggableCursor", "draggingCursor", "fullscreenControl", "fullscreenControlOptions", "gestureHandling", "headingInteractionEnabled", "isFractionalZoomEnabled", "keyboardShortcuts", "mapTypeControl", "mapTypeControlOptions", "mapTypeId", "maxZoom", "minZoom", "noClear", "panControl", "panControlOptions", "restriction", "rotateControl", "rotateControlOptions", "scaleControl", "scaleControlOptions", "scrollwheel", "streetView", "streetViewControl", "streetViewControlOptions", "styles", "tiltInteractionEnabled", "zoomControl", "zoomControlOptions"]);
function useMapOptions(map, mapProps) {
  const mapOptions = {};
  const keys = Object.keys(mapProps);
  for (const key of keys) {
    if (!mapOptionKeys.has(key)) continue;
    mapOptions[key] = mapProps[key];
  }
  useDeepCompareEffect(() => {
    if (!map) return;
    map.setOptions(mapOptions);
  }, [mapOptions]);
}
function useApiLoadingStatus() {
  var _useContext;
  return ((_useContext = (0, import_react.useContext)(APIProviderContext)) == null ? void 0 : _useContext.status) || APILoadingStatus.NOT_LOADED;
}
function useDeckGLCameraUpdate(map, props) {
  const {
    viewport,
    viewState
  } = props;
  const isDeckGlControlled = !!viewport;
  (0, import_react.useLayoutEffect)(() => {
    if (!map || !viewState) return;
    const {
      latitude,
      longitude,
      bearing: heading,
      pitch: tilt,
      zoom
    } = viewState;
    map.moveCamera({
      center: {
        lat: latitude,
        lng: longitude
      },
      heading,
      tilt,
      zoom: zoom + 1
    });
  }, [map, viewState]);
  return isDeckGlControlled;
}
function isLatLngLiteral(obj) {
  if (!obj || typeof obj !== "object") return false;
  if (!("lat" in obj && "lng" in obj)) return false;
  return Number.isFinite(obj.lat) && Number.isFinite(obj.lng);
}
function latLngEquals(a, b) {
  if (!a || !b) return false;
  const A = toLatLngLiteral(a);
  const B = toLatLngLiteral(b);
  if (A.lat !== B.lat || A.lng !== B.lng) return false;
  return true;
}
function toLatLngLiteral(obj) {
  if (isLatLngLiteral(obj)) return obj;
  return obj.toJSON();
}
function useMapCameraParams(map, cameraStateRef, mapProps) {
  const center = mapProps.center ? toLatLngLiteral(mapProps.center) : null;
  let lat = null;
  let lng = null;
  if (center && Number.isFinite(center.lat) && Number.isFinite(center.lng)) {
    lat = center.lat;
    lng = center.lng;
  }
  const zoom = Number.isFinite(mapProps.zoom) ? mapProps.zoom : null;
  const heading = Number.isFinite(mapProps.heading) ? mapProps.heading : null;
  const tilt = Number.isFinite(mapProps.tilt) ? mapProps.tilt : null;
  (0, import_react.useLayoutEffect)(() => {
    if (!map) return;
    const nextCamera = {};
    let needsUpdate = false;
    if (lat !== null && lng !== null && (cameraStateRef.current.center.lat !== lat || cameraStateRef.current.center.lng !== lng)) {
      nextCamera.center = {
        lat,
        lng
      };
      needsUpdate = true;
    }
    if (zoom !== null && cameraStateRef.current.zoom !== zoom) {
      nextCamera.zoom = zoom;
      needsUpdate = true;
    }
    if (heading !== null && cameraStateRef.current.heading !== heading) {
      nextCamera.heading = heading;
      needsUpdate = true;
    }
    if (tilt !== null && cameraStateRef.current.tilt !== tilt) {
      nextCamera.tilt = tilt;
      needsUpdate = true;
    }
    if (needsUpdate) {
      map.moveCamera(nextCamera);
    }
  });
}
var AuthFailureMessage = () => {
  const style = {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 999,
    display: "flex",
    flexFlow: "column nowrap",
    textAlign: "center",
    justifyContent: "center",
    fontSize: ".8rem",
    color: "rgba(0,0,0,0.6)",
    background: "#dddddd",
    padding: "1rem 1.5rem"
  };
  return import_react.default.createElement("div", {
    style
  }, import_react.default.createElement("h2", null, "Error: AuthFailure"), import_react.default.createElement("p", null, "A problem with your API key prevents the map from rendering correctly. Please make sure the value of the ", import_react.default.createElement("code", null, "APIProvider.apiKey"), " prop is correct. Check the error-message in the console for further details."));
};
function useCallbackRef() {
  const [el, setEl] = (0, import_react.useState)(null);
  const ref = (0, import_react.useCallback)((value) => setEl(value), [setEl]);
  return [el, ref];
}
function useApiIsLoaded() {
  const status = useApiLoadingStatus();
  return status === APILoadingStatus.LOADED;
}
function useForceUpdate() {
  const [, forceUpdate] = (0, import_react.useReducer)((x) => x + 1, 0);
  return forceUpdate;
}
function handleBoundsChange(map, ref) {
  const center = map.getCenter();
  const zoom = map.getZoom();
  const heading = map.getHeading() || 0;
  const tilt = map.getTilt() || 0;
  const bounds = map.getBounds();
  if (!center || !bounds || !Number.isFinite(zoom)) {
    console.warn("[useTrackedCameraState] at least one of the values from the map returned undefined. This is not expected to happen. Please report an issue at https://github.com/visgl/react-google-maps/issues/new");
  }
  Object.assign(ref.current, {
    center: (center == null ? void 0 : center.toJSON()) || {
      lat: 0,
      lng: 0
    },
    zoom: zoom || 0,
    heading,
    tilt
  });
}
function useTrackedCameraStateRef(map) {
  const forceUpdate = useForceUpdate();
  const ref = (0, import_react.useRef)({
    center: {
      lat: 0,
      lng: 0
    },
    heading: 0,
    tilt: 0,
    zoom: 0
  });
  (0, import_react.useEffect)(() => {
    if (!map) return;
    const listener = google.maps.event.addListener(map, "bounds_changed", () => {
      handleBoundsChange(map, ref);
      forceUpdate();
    });
    return () => listener.remove();
  }, [map, forceUpdate]);
  return ref;
}
var _excluded$2 = ["id", "defaultBounds", "defaultCenter", "defaultZoom", "defaultHeading", "defaultTilt", "reuseMaps", "renderingType", "colorScheme"];
var _excluded2 = ["padding"];
var CachedMapStack = class {
  static has(key) {
    return this.entries[key] && this.entries[key].length > 0;
  }
  static pop(key) {
    if (!this.entries[key]) return null;
    return this.entries[key].pop() || null;
  }
  static push(key, value) {
    if (!this.entries[key]) this.entries[key] = [];
    this.entries[key].push(value);
  }
};
CachedMapStack.entries = {};
function useMapInstance(props, context) {
  const apiIsLoaded = useApiIsLoaded();
  const [map, setMap] = (0, import_react.useState)(null);
  const [container, containerRef] = useCallbackRef();
  const cameraStateRef = useTrackedCameraStateRef(map);
  const {
    id,
    defaultBounds,
    defaultCenter,
    defaultZoom,
    defaultHeading,
    defaultTilt,
    reuseMaps,
    renderingType,
    colorScheme
  } = props, mapOptions = _objectWithoutPropertiesLoose(props, _excluded$2);
  const hasZoom = props.zoom !== void 0 || props.defaultZoom !== void 0;
  const hasCenter = props.center !== void 0 || props.defaultCenter !== void 0;
  if (!defaultBounds && (!hasZoom || !hasCenter)) {
    console.warn("<Map> component is missing configuration. You have to provide zoom and center (via the `zoom`/`defaultZoom` and `center`/`defaultCenter` props) or specify the region to show using `defaultBounds`. See https://visgl.github.io/react-google-maps/docs/api-reference/components/map#required");
  }
  if (!mapOptions.center && defaultCenter) mapOptions.center = defaultCenter;
  if (!mapOptions.zoom && Number.isFinite(defaultZoom)) mapOptions.zoom = defaultZoom;
  if (!mapOptions.heading && Number.isFinite(defaultHeading)) mapOptions.heading = defaultHeading;
  if (!mapOptions.tilt && Number.isFinite(defaultTilt)) mapOptions.tilt = defaultTilt;
  for (const key of Object.keys(mapOptions)) if (mapOptions[key] === void 0) delete mapOptions[key];
  const savedMapStateRef = (0, import_react.useRef)(void 0);
  (0, import_react.useEffect)(
    () => {
      if (!container || !apiIsLoaded) return;
      const {
        addMapInstance,
        removeMapInstance
      } = context;
      const {
        mapId
      } = props;
      const cacheKey = `${mapId || "default"}:${renderingType || "default"}:${colorScheme || "LIGHT"}`;
      let mapDiv;
      let map2;
      if (reuseMaps && CachedMapStack.has(cacheKey)) {
        map2 = CachedMapStack.pop(cacheKey);
        mapDiv = map2.getDiv();
        container.appendChild(mapDiv);
        map2.setOptions(mapOptions);
        setTimeout(() => map2.setCenter(map2.getCenter()), 0);
      } else {
        mapDiv = document.createElement("div");
        mapDiv.style.height = "100%";
        container.appendChild(mapDiv);
        map2 = new google.maps.Map(mapDiv, _extends({}, mapOptions, renderingType ? {
          renderingType
        } : {}, colorScheme ? {
          colorScheme
        } : {}));
      }
      setMap(map2);
      addMapInstance(map2, id);
      if (defaultBounds) {
        const {
          padding
        } = defaultBounds, defBounds = _objectWithoutPropertiesLoose(defaultBounds, _excluded2);
        map2.fitBounds(defBounds, padding);
      } else if (!hasZoom || !hasCenter) {
        map2.fitBounds({
          east: 180,
          west: -180,
          south: -90,
          north: 90
        });
      }
      if (savedMapStateRef.current) {
        const {
          mapId: savedMapId,
          cameraState: savedCameraState
        } = savedMapStateRef.current;
        if (savedMapId !== mapId) {
          map2.setOptions(savedCameraState);
        }
      }
      return () => {
        savedMapStateRef.current = {
          mapId,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          cameraState: cameraStateRef.current
        };
        mapDiv.remove();
        if (reuseMaps) {
          CachedMapStack.push(cacheKey, map2);
        } else {
          google.maps.event.clearInstanceListeners(map2);
        }
        setMap(null);
        removeMapInstance(id);
      };
    },
    // some dependencies are ignored in the list below:
    //  - defaultBounds and the default* camera props will only be used once, and
    //    changes should be ignored
    //  - mapOptions has special hooks that take care of updating the options
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      container,
      apiIsLoaded,
      id,
      // these props can't be changed after initialization and require a new
      // instance to be created
      props.mapId,
      props.renderingType,
      props.colorScheme
    ]
  );
  return [map, containerRef, cameraStateRef];
}
var GoogleMapsContext = import_react.default.createContext(null);
var ColorScheme = {
  DARK: "DARK",
  LIGHT: "LIGHT",
  FOLLOW_SYSTEM: "FOLLOW_SYSTEM"
};
var RenderingType = {
  VECTOR: "VECTOR",
  RASTER: "RASTER",
  UNINITIALIZED: "UNINITIALIZED"
};
var Map = (props) => {
  const {
    children,
    id,
    className,
    style
  } = props;
  const context = (0, import_react.useContext)(APIProviderContext);
  const loadingStatus = useApiLoadingStatus();
  if (!context) {
    throw new Error("<Map> can only be used inside an <ApiProvider> component.");
  }
  const [map, mapRef, cameraStateRef] = useMapInstance(props, context);
  useMapCameraParams(map, cameraStateRef, props);
  useMapEvents(map, props);
  useMapOptions(map, props);
  const isDeckGlControlled = useDeckGLCameraUpdate(map, props);
  const isControlledExternally = !!props.controlled;
  (0, import_react.useEffect)(() => {
    if (!map) return;
    if (isDeckGlControlled) {
      map.setOptions({
        disableDefaultUI: true
      });
    }
    if (isDeckGlControlled || isControlledExternally) {
      map.setOptions({
        gestureHandling: "none",
        keyboardShortcuts: false
      });
    }
    return () => {
      map.setOptions({
        gestureHandling: props.gestureHandling,
        keyboardShortcuts: props.keyboardShortcuts
      });
    };
  }, [map, isDeckGlControlled, isControlledExternally, props.gestureHandling, props.keyboardShortcuts]);
  const center = props.center ? toLatLngLiteral(props.center) : null;
  let lat = null;
  let lng = null;
  if (center && Number.isFinite(center.lat) && Number.isFinite(center.lng)) {
    lat = center.lat;
    lng = center.lng;
  }
  const cameraOptions = (0, import_react.useMemo)(() => {
    var _lat, _lng, _props$zoom, _props$heading, _props$tilt;
    return {
      center: {
        lat: (_lat = lat) != null ? _lat : 0,
        lng: (_lng = lng) != null ? _lng : 0
      },
      zoom: (_props$zoom = props.zoom) != null ? _props$zoom : 0,
      heading: (_props$heading = props.heading) != null ? _props$heading : 0,
      tilt: (_props$tilt = props.tilt) != null ? _props$tilt : 0
    };
  }, [lat, lng, props.zoom, props.heading, props.tilt]);
  (0, import_react.useLayoutEffect)(() => {
    if (!map || !isControlledExternally) return;
    map.moveCamera(cameraOptions);
    const listener = map.addListener("bounds_changed", () => {
      map.moveCamera(cameraOptions);
    });
    return () => listener.remove();
  }, [map, isControlledExternally, cameraOptions]);
  const combinedStyle = (0, import_react.useMemo)(() => _extends({
    width: "100%",
    height: "100%",
    position: "relative",
    // when using deckgl, the map should be sent to the back
    zIndex: isDeckGlControlled ? -1 : 0
  }, style), [style, isDeckGlControlled]);
  const contextValue = (0, import_react.useMemo)(() => ({
    map
  }), [map]);
  if (loadingStatus === APILoadingStatus.AUTH_FAILURE) {
    return import_react.default.createElement("div", {
      style: _extends({
        position: "relative"
      }, className ? {} : combinedStyle),
      className
    }, import_react.default.createElement(AuthFailureMessage, null));
  }
  return import_react.default.createElement("div", _extends({
    ref: mapRef,
    "data-testid": "map",
    style: className ? void 0 : combinedStyle,
    className
  }, id ? {
    id
  } : {}), map ? import_react.default.createElement(GoogleMapsContext.Provider, {
    value: contextValue
  }, children) : null);
};
Map.deckGLViewProps = true;
var shownMessages = /* @__PURE__ */ new Set();
function logErrorOnce(...args) {
  const key = JSON.stringify(args);
  if (!shownMessages.has(key)) {
    shownMessages.add(key);
    console.error(...args);
  }
}
var useMap = (id = null) => {
  const ctx = (0, import_react.useContext)(APIProviderContext);
  const {
    map
  } = (0, import_react.useContext)(GoogleMapsContext) || {};
  if (ctx === null) {
    logErrorOnce("useMap(): failed to retrieve APIProviderContext. Make sure that the <APIProvider> component exists and that the component you are calling `useMap()` from is a sibling of the <APIProvider>.");
    return null;
  }
  const {
    mapInstances
  } = ctx;
  if (id !== null) return mapInstances[id] || null;
  if (map) return map;
  return mapInstances["default"] || null;
};
function useMapsLibrary(name) {
  const apiIsLoaded = useApiIsLoaded();
  const ctx = (0, import_react.useContext)(APIProviderContext);
  (0, import_react.useEffect)(() => {
    if (!apiIsLoaded || !ctx) return;
    void ctx.importLibrary(name);
  }, [apiIsLoaded, ctx, name]);
  return (ctx == null ? void 0 : ctx.loadedLibraries[name]) || null;
}
function useMapsEventListener(target, name, callback) {
  (0, import_react.useEffect)(() => {
    if (!target || !name || !callback) return;
    const listener = google.maps.event.addListener(target, name, callback);
    return () => listener.remove();
  }, [target, name, callback]);
}
function usePropBinding(object, prop, value) {
  (0, import_react.useEffect)(() => {
    if (!object) return;
    object[prop] = value;
  }, [object, prop, value]);
}
function useDomEventListener(target, name, callback) {
  (0, import_react.useEffect)(() => {
    if (!target || !name || !callback) return;
    target.addEventListener(name, callback);
    return () => target.removeEventListener(name, callback);
  }, [target, name, callback]);
}
function isAdvancedMarker(marker) {
  return marker.content !== void 0;
}
function isElementNode(node) {
  return node.nodeType === Node.ELEMENT_NODE;
}
var CollisionBehavior = {
  REQUIRED: "REQUIRED",
  REQUIRED_AND_HIDES_OPTIONAL: "REQUIRED_AND_HIDES_OPTIONAL",
  OPTIONAL_AND_HIDES_LOWER_PRIORITY: "OPTIONAL_AND_HIDES_LOWER_PRIORITY"
};
var AdvancedMarkerContext = import_react.default.createContext(null);
var AdvancedMarkerAnchorPoint = {
  TOP_LEFT: ["0%", "0%"],
  TOP_CENTER: ["50%", "0%"],
  TOP: ["50%", "0%"],
  TOP_RIGHT: ["100%", "0%"],
  LEFT_CENTER: ["0%", "50%"],
  LEFT_TOP: ["0%", "0%"],
  LEFT: ["0%", "50%"],
  LEFT_BOTTOM: ["0%", "100%"],
  RIGHT_TOP: ["100%", "0%"],
  RIGHT: ["100%", "50%"],
  RIGHT_CENTER: ["100%", "50%"],
  RIGHT_BOTTOM: ["100%", "100%"],
  BOTTOM_LEFT: ["0%", "100%"],
  BOTTOM_CENTER: ["50%", "100%"],
  BOTTOM: ["50%", "100%"],
  BOTTOM_RIGHT: ["100%", "100%"],
  CENTER: ["50%", "50%"]
};
var MarkerContent = ({
  children,
  styles,
  className,
  anchorPoint
}) => {
  const [xTranslation, yTranslation] = anchorPoint != null ? anchorPoint : AdvancedMarkerAnchorPoint["BOTTOM"];
  let xTranslationFlipped = `-${xTranslation}`;
  let yTranslationFlipped = `-${yTranslation}`;
  if (xTranslation.trimStart().startsWith("-")) {
    xTranslationFlipped = xTranslation.substring(1);
  }
  if (yTranslation.trimStart().startsWith("-")) {
    yTranslationFlipped = yTranslation.substring(1);
  }
  const transformStyle = `translate(50%, 100%) translate(${xTranslationFlipped}, ${yTranslationFlipped})`;
  return (
    // anchoring container
    import_react.default.createElement("div", {
      style: {
        transform: transformStyle
      }
    }, import_react.default.createElement("div", {
      className,
      style: styles
    }, children))
  );
};
function useAdvancedMarker(props) {
  const [marker, setMarker] = (0, import_react.useState)(null);
  const [contentContainer, setContentContainer] = (0, import_react.useState)(null);
  const map = useMap();
  const markerLibrary = useMapsLibrary("marker");
  const {
    children,
    onClick,
    className,
    onMouseEnter,
    onMouseLeave,
    onDrag,
    onDragStart,
    onDragEnd,
    collisionBehavior,
    clickable,
    draggable,
    position,
    title,
    zIndex
  } = props;
  const numChildren = import_react.Children.count(children);
  (0, import_react.useEffect)(() => {
    if (!map || !markerLibrary) return;
    const newMarker = new markerLibrary.AdvancedMarkerElement();
    newMarker.map = map;
    setMarker(newMarker);
    let contentElement = null;
    if (numChildren > 0) {
      contentElement = document.createElement("div");
      contentElement.isCustomMarker = true;
      newMarker.content = contentElement;
      setContentContainer(contentElement);
    }
    return () => {
      var _contentElement;
      newMarker.map = null;
      (_contentElement = contentElement) == null || _contentElement.remove();
      setMarker(null);
      setContentContainer(null);
    };
  }, [map, markerLibrary, numChildren]);
  (0, import_react.useEffect)(() => {
    if (!(marker != null && marker.content) || !isElementNode(marker.content) || numChildren > 0) return;
    marker.content.className = className != null ? className : "";
  }, [marker, className, numChildren]);
  usePropBinding(marker, "position", position);
  usePropBinding(marker, "title", title != null ? title : "");
  usePropBinding(marker, "zIndex", zIndex);
  usePropBinding(marker, "collisionBehavior", collisionBehavior);
  (0, import_react.useEffect)(() => {
    if (!marker) return;
    if (draggable !== void 0) marker.gmpDraggable = draggable;
    else if (onDrag || onDragStart || onDragEnd) marker.gmpDraggable = true;
    else marker.gmpDraggable = false;
  }, [marker, draggable, onDrag, onDragEnd, onDragStart]);
  (0, import_react.useEffect)(() => {
    if (!marker) return;
    const gmpClickable = clickable !== void 0 || Boolean(onClick) || Boolean(onMouseEnter) || Boolean(onMouseLeave);
    marker.gmpClickable = gmpClickable;
    if (gmpClickable && marker != null && marker.content && isElementNode(marker.content)) {
      marker.content.style.pointerEvents = "none";
      if (marker.content.firstElementChild) {
        marker.content.firstElementChild.style.pointerEvents = "all";
      }
    }
  }, [marker, clickable, onClick, onMouseEnter, onMouseLeave]);
  useMapsEventListener(marker, "click", onClick);
  useMapsEventListener(marker, "drag", onDrag);
  useMapsEventListener(marker, "dragstart", onDragStart);
  useMapsEventListener(marker, "dragend", onDragEnd);
  useDomEventListener(marker == null ? void 0 : marker.element, "mouseenter", onMouseEnter);
  useDomEventListener(marker == null ? void 0 : marker.element, "mouseleave", onMouseLeave);
  return [marker, contentContainer];
}
var AdvancedMarker = (0, import_react.forwardRef)((props, ref) => {
  const {
    children,
    style,
    className,
    anchorPoint
  } = props;
  const [marker, contentContainer] = useAdvancedMarker(props);
  const advancedMarkerContextValue = (0, import_react.useMemo)(() => marker ? {
    marker
  } : null, [marker]);
  (0, import_react.useImperativeHandle)(ref, () => marker, [marker]);
  if (!contentContainer) return null;
  return import_react.default.createElement(AdvancedMarkerContext.Provider, {
    value: advancedMarkerContextValue
  }, (0, import_react_dom.createPortal)(import_react.default.createElement(MarkerContent, {
    anchorPoint,
    styles: style,
    className
  }, children), contentContainer));
});
function useAdvancedMarkerRef() {
  const [marker, setMarker] = (0, import_react.useState)(null);
  const refCallback = (0, import_react.useCallback)((m) => {
    setMarker(m);
  }, []);
  return [refCallback, marker];
}
function setValueForStyles(element, styles, prevStyles) {
  if (styles != null && typeof styles !== "object") {
    throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
  }
  const elementStyle = element.style;
  if (prevStyles == null) {
    if (styles == null) return;
    for (const styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) continue;
      setValueForStyle(elementStyle, styleName, styles[styleName]);
    }
    return;
  }
  for (const styleName in prevStyles) {
    if (prevStyles.hasOwnProperty(styleName) && (styles == null || !styles.hasOwnProperty(styleName))) {
      const isCustomProperty = styleName.indexOf("--") === 0;
      if (isCustomProperty) {
        elementStyle.setProperty(styleName, "");
      } else if (styleName === "float") {
        elementStyle.cssFloat = "";
      } else {
        elementStyle[styleName] = "";
      }
    }
  }
  if (styles == null) return;
  for (const styleName in styles) {
    const value = styles[styleName];
    if (styles.hasOwnProperty(styleName) && prevStyles[styleName] !== value) {
      setValueForStyle(elementStyle, styleName, value);
    }
  }
}
function setValueForStyle(elementStyle, styleName, value) {
  const isCustomProperty = styleName.indexOf("--") === 0;
  if (value == null || typeof value === "boolean" || value === "") {
    if (isCustomProperty) {
      elementStyle.setProperty(styleName, "");
    } else if (styleName === "float") {
      elementStyle.cssFloat = "";
    } else {
      elementStyle[styleName] = "";
    }
  } else if (isCustomProperty) {
    elementStyle.setProperty(styleName, value);
  } else if (typeof value === "number" && value !== 0 && !isUnitlessNumber(styleName)) {
    elementStyle[styleName] = value + "px";
  } else {
    if (styleName === "float") {
      elementStyle.cssFloat = value;
    } else {
      elementStyle[styleName] = ("" + value).trim();
    }
  }
}
var unitlessNumbers = /* @__PURE__ */ new Set([
  "animationIterationCount",
  "aspectRatio",
  "borderImageOutset",
  "borderImageSlice",
  "borderImageWidth",
  "boxFlex",
  "boxFlexGroup",
  "boxOrdinalGroup",
  "columnCount",
  "columns",
  "flex",
  "flexGrow",
  "flexPositive",
  "flexShrink",
  "flexNegative",
  "flexOrder",
  "gridArea",
  "gridRow",
  "gridRowEnd",
  "gridRowSpan",
  "gridRowStart",
  "gridColumn",
  "gridColumnEnd",
  "gridColumnSpan",
  "gridColumnStart",
  "fontWeight",
  "lineClamp",
  "lineHeight",
  "opacity",
  "order",
  "orphans",
  "scale",
  "tabSize",
  "widows",
  "zIndex",
  "zoom",
  "fillOpacity",
  // SVG-related properties
  "floodOpacity",
  "stopOpacity",
  "strokeDasharray",
  "strokeDashoffset",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth"
]);
function isUnitlessNumber(name) {
  return unitlessNumbers.has(name);
}
var _excluded$1 = ["children", "headerContent", "style", "className", "pixelOffset", "anchor", "shouldFocus", "onClose", "onCloseClick"];
var InfoWindow = (props) => {
  const {
    // content options
    children,
    headerContent,
    style,
    className,
    pixelOffset,
    // open options
    anchor,
    shouldFocus,
    // events
    onClose,
    onCloseClick
    // other options
  } = props, volatileInfoWindowOptions = _objectWithoutPropertiesLoose(props, _excluded$1);
  const mapsLibrary = useMapsLibrary("maps");
  const [infoWindow, setInfoWindow] = (0, import_react.useState)(null);
  const contentContainerRef = (0, import_react.useRef)(null);
  const headerContainerRef = (0, import_react.useRef)(null);
  const infoWindowOptions = useMemoized(volatileInfoWindowOptions, import_fast_deep_equal.default);
  (0, import_react.useEffect)(
    () => {
      if (!mapsLibrary) return;
      contentContainerRef.current = document.createElement("div");
      headerContainerRef.current = document.createElement("div");
      const opts = infoWindowOptions;
      if (pixelOffset) {
        opts.pixelOffset = new google.maps.Size(pixelOffset[0], pixelOffset[1]);
      }
      if (headerContent) {
        opts.headerContent = typeof headerContent === "string" ? headerContent : headerContainerRef.current;
      }
      const infoWindow2 = new google.maps.InfoWindow(infoWindowOptions);
      infoWindow2.setContent(contentContainerRef.current);
      setInfoWindow(infoWindow2);
      return () => {
        var _contentContainerRef$, _headerContainerRef$c;
        infoWindow2.setContent(null);
        (_contentContainerRef$ = contentContainerRef.current) == null || _contentContainerRef$.remove();
        (_headerContainerRef$c = headerContainerRef.current) == null || _headerContainerRef$c.remove();
        contentContainerRef.current = null;
        headerContainerRef.current = null;
        setInfoWindow(null);
      };
    },
    // `infoWindowOptions` and other props are missing from dependencies:
    //
    // We don't want to re-create the infowindow instance
    // when the options change.
    // Updating the options is handled in the useEffect below.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapsLibrary]
  );
  const prevStyleRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (!infoWindow || !contentContainerRef.current) return;
    setValueForStyles(contentContainerRef.current, style || null, prevStyleRef.current);
    prevStyleRef.current = style || null;
    if (className !== contentContainerRef.current.className) contentContainerRef.current.className = className || "";
  }, [infoWindow, className, style]);
  (0, import_react.useEffect)(
    () => {
      if (!infoWindow) return;
      const opts = infoWindowOptions;
      if (!pixelOffset) {
        opts.pixelOffset = null;
      } else {
        opts.pixelOffset = new google.maps.Size(pixelOffset[0], pixelOffset[1]);
      }
      if (!headerContent) {
        opts.headerContent = null;
      } else {
        opts.headerContent = typeof headerContent === "string" ? headerContent : headerContainerRef.current;
      }
      infoWindow.setOptions(infoWindowOptions);
    },
    // dependency `infoWindow` isn't needed since options are also passed
    // to the constructor when a new infoWindow is created.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [infoWindowOptions, pixelOffset, headerContent]
  );
  useMapsEventListener(infoWindow, "close", onClose);
  useMapsEventListener(infoWindow, "closeclick", onCloseClick);
  const map = useMap();
  (0, import_react.useEffect)(() => {
    if (!map || !infoWindow || anchor === null) return;
    const isOpenedWithAnchor = !!anchor;
    const openOptions = {
      map
    };
    if (anchor) {
      openOptions.anchor = anchor;
      if (isAdvancedMarker(anchor) && anchor.content instanceof Element) {
        const wrapper = anchor.content;
        const wrapperBcr = wrapper == null ? void 0 : wrapper.getBoundingClientRect();
        if (wrapperBcr && wrapper != null && wrapper.isCustomMarker) {
          var _anchor$content$first;
          const anchorDomContent = (_anchor$content$first = anchor.content.firstElementChild) == null ? void 0 : _anchor$content$first.firstElementChild;
          const contentBcr = anchorDomContent == null ? void 0 : anchorDomContent.getBoundingClientRect();
          const anchorOffsetX = contentBcr.x - wrapperBcr.x + (contentBcr.width - wrapperBcr.width) / 2;
          const anchorOffsetY = contentBcr.y - wrapperBcr.y;
          const opts = infoWindowOptions;
          opts.pixelOffset = new google.maps.Size(pixelOffset ? pixelOffset[0] + anchorOffsetX : anchorOffsetX, pixelOffset ? pixelOffset[1] + anchorOffsetY : anchorOffsetY);
          infoWindow.setOptions(opts);
        }
      }
    }
    if (shouldFocus !== void 0) {
      openOptions.shouldFocus = shouldFocus;
    }
    infoWindow.open(openOptions);
    return () => {
      if (isOpenedWithAnchor) infoWindow.set("anchor", null);
      infoWindow.close();
    };
  }, [infoWindow, anchor, map, shouldFocus, infoWindowOptions, pixelOffset]);
  return import_react.default.createElement(import_react.default.Fragment, null, contentContainerRef.current && (0, import_react_dom.createPortal)(children, contentContainerRef.current), headerContainerRef.current !== null && (0, import_react_dom.createPortal)(headerContent, headerContainerRef.current));
};
function formatLocation(location) {
  return typeof location === "string" ? location : `${location.lat},${location.lng}`;
}
function formatParam(string) {
  return string.slice(1);
}
function assembleMarkerParams(markers = []) {
  const markerParams = [];
  const markersByStyle = markers == null ? void 0 : markers.reduce((styles, marker) => {
    const {
      color = "red",
      label,
      size,
      scale,
      icon,
      anchor
    } = marker;
    const relevantProps = icon ? [icon, anchor, scale] : [color, label, size];
    const key = relevantProps.filter(Boolean).join("-");
    styles[key] = styles[key] || [];
    styles[key].push(marker);
    return styles;
  }, {});
  Object.values(markersByStyle != null ? markersByStyle : {}).forEach((markers2) => {
    let markerParam = "";
    const {
      icon
    } = markers2[0];
    Object.entries(markers2[0]).forEach(([key, value]) => {
      const relevantKeys = icon ? ["icon", "anchor", "scale"] : ["color", "label", "size"];
      if (relevantKeys.includes(key)) {
        markerParam += `|${key}:${value}`;
      }
    });
    for (const marker of markers2) {
      const location = typeof marker.location === "string" ? marker.location : `${marker.location.lat},${marker.location.lng}`;
      markerParam += `|${location}`;
    }
    markerParams.push(markerParam);
  });
  return markerParams.map(formatParam);
}
function assemblePathParams(paths = []) {
  const pathParams = [];
  const pathsByStyle = paths == null ? void 0 : paths.reduce((styles, path) => {
    const {
      color = "default",
      weight,
      fillcolor,
      geodesic
    } = path;
    const key = [color, weight, fillcolor, geodesic].filter(Boolean).join("-");
    styles[key] = styles[key] || [];
    styles[key].push(path);
    return styles;
  }, {});
  Object.values(pathsByStyle != null ? pathsByStyle : {}).forEach((paths2) => {
    let pathParam = "";
    Object.entries(paths2[0]).forEach(([key, value]) => {
      if (["color", "weight", "fillcolor", "geodesic"].includes(key)) {
        pathParam += `|${key}:${value}`;
      }
    });
    for (const path of paths2) {
      if (typeof path.coordinates === "string") {
        pathParam += `|${decodeURIComponent(path.coordinates)}`;
      } else {
        for (const location of path.coordinates) {
          pathParam += `|${formatLocation(location)}`;
        }
      }
    }
    pathParams.push(pathParam);
  });
  return pathParams.map(formatParam);
}
function assembleMapTypeStyles(styles) {
  return styles.map((mapTypeStyle) => {
    const {
      featureType,
      elementType,
      stylers = []
    } = mapTypeStyle;
    let styleString = "";
    if (featureType) {
      styleString += `|feature:${featureType}`;
    }
    if (elementType) {
      styleString += `|element:${elementType}`;
    }
    for (const styler of stylers) {
      Object.entries(styler).forEach(([name, value]) => {
        styleString += `|${name}:${String(value).replace("#", "0x")}`;
      });
    }
    return styleString;
  }).map(formatParam);
}
var STATIC_MAPS_BASE = "https://maps.googleapis.com/maps/api/staticmap";
function createStaticMapsUrl({
  apiKey,
  width,
  height,
  center,
  zoom,
  scale,
  format,
  mapType,
  language,
  region,
  mapId,
  markers = [],
  paths = [],
  visible = [],
  style = []
}) {
  if (!apiKey) {
    console.warn("API key is required");
  }
  if (!width || !height) {
    console.warn("Width and height are required");
  }
  const params = _extends({
    key: apiKey,
    size: `${width}x${height}`
  }, center && {
    center: formatLocation(center)
  }, zoom && {
    zoom
  }, scale && {
    scale
  }, format && {
    format
  }, mapType && {
    maptype: mapType
  }, language && {
    language
  }, region && {
    region
  }, mapId && {
    map_id: mapId
  });
  const url = new URL(STATIC_MAPS_BASE);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  for (const markerParam of assembleMarkerParams(markers)) {
    url.searchParams.append("markers", markerParam);
  }
  for (const pathParam of assemblePathParams(paths)) {
    url.searchParams.append("path", pathParam);
  }
  if (visible.length) {
    url.searchParams.append("visible", visible.map((location) => formatLocation(location)).join("|"));
  }
  for (const styleString of assembleMapTypeStyles(style)) {
    url.searchParams.append("style", styleString);
  }
  return url.toString();
}
var StaticMap = (props) => {
  const {
    url,
    className
  } = props;
  if (!url) throw new Error("URL is required");
  return import_react.default.createElement("img", {
    className,
    src: url,
    width: "100%"
  });
};
var ControlPosition = {
  TOP_LEFT: 1,
  TOP_CENTER: 2,
  TOP: 2,
  TOP_RIGHT: 3,
  LEFT_CENTER: 4,
  LEFT_TOP: 5,
  LEFT: 5,
  LEFT_BOTTOM: 6,
  RIGHT_TOP: 7,
  RIGHT: 7,
  RIGHT_CENTER: 8,
  RIGHT_BOTTOM: 9,
  BOTTOM_LEFT: 10,
  BOTTOM_CENTER: 11,
  BOTTOM: 11,
  BOTTOM_RIGHT: 12,
  CENTER: 13,
  BLOCK_START_INLINE_START: 14,
  BLOCK_START_INLINE_CENTER: 15,
  BLOCK_START_INLINE_END: 16,
  INLINE_START_BLOCK_CENTER: 17,
  INLINE_START_BLOCK_START: 18,
  INLINE_START_BLOCK_END: 19,
  INLINE_END_BLOCK_START: 20,
  INLINE_END_BLOCK_CENTER: 21,
  INLINE_END_BLOCK_END: 22,
  BLOCK_END_INLINE_START: 23,
  BLOCK_END_INLINE_CENTER: 24,
  BLOCK_END_INLINE_END: 25
};
var MapControl = ({
  children,
  position
}) => {
  const controlContainer = (0, import_react.useMemo)(() => document.createElement("div"), []);
  const map = useMap();
  (0, import_react.useEffect)(() => {
    if (!map) return;
    const controls = map.controls[position];
    controls.push(controlContainer);
    return () => {
      const controlsArray = controls.getArray();
      if (!controlsArray) return;
      const index = controlsArray.indexOf(controlContainer);
      controls.removeAt(index);
    };
  }, [controlContainer, map, position]);
  return (0, import_react_dom.createPortal)(children, controlContainer);
};
var _excluded = ["onClick", "onDrag", "onDragStart", "onDragEnd", "onMouseOver", "onMouseOut"];
function useMarker(props) {
  const [marker, setMarker] = (0, import_react.useState)(null);
  const map = useMap();
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut
  } = props, markerOptions = _objectWithoutPropertiesLoose(props, _excluded);
  const {
    position,
    draggable
  } = markerOptions;
  (0, import_react.useEffect)(() => {
    if (!map) {
      if (map === void 0) console.error("<Marker> has to be inside a Map component.");
      return;
    }
    const newMarker = new google.maps.Marker(markerOptions);
    newMarker.setMap(map);
    setMarker(newMarker);
    return () => {
      newMarker.setMap(null);
      setMarker(null);
    };
  }, [map]);
  (0, import_react.useEffect)(() => {
    if (!marker) return;
    const m = marker;
    const gme = google.maps.event;
    if (onClick) gme.addListener(m, "click", onClick);
    if (onDrag) gme.addListener(m, "drag", onDrag);
    if (onDragStart) gme.addListener(m, "dragstart", onDragStart);
    if (onDragEnd) gme.addListener(m, "dragend", onDragEnd);
    if (onMouseOver) gme.addListener(m, "mouseover", onMouseOver);
    if (onMouseOut) gme.addListener(m, "mouseout", onMouseOut);
    marker.setDraggable(Boolean(draggable));
    return () => {
      gme.clearInstanceListeners(m);
    };
  }, [marker, draggable, onClick, onDrag, onDragStart, onDragEnd, onMouseOver, onMouseOut]);
  (0, import_react.useEffect)(() => {
    if (!marker) return;
    if (markerOptions) marker.setOptions(markerOptions);
  }, [marker, markerOptions]);
  (0, import_react.useEffect)(() => {
    if (draggable || !position || !marker) return;
    marker.setPosition(position);
  }, [draggable, position, marker]);
  return marker;
}
var Marker = (0, import_react.forwardRef)((props, ref) => {
  const marker = useMarker(props);
  (0, import_react.useImperativeHandle)(ref, () => marker, [marker]);
  return import_react.default.createElement(import_react.default.Fragment, null);
});
function useMarkerRef() {
  const [marker, setMarker] = (0, import_react.useState)(null);
  const refCallback = (0, import_react.useCallback)((m) => {
    setMarker(m);
  }, []);
  return [refCallback, marker];
}
var Pin = (props) => {
  var _useContext;
  const advancedMarker = (_useContext = (0, import_react.useContext)(AdvancedMarkerContext)) == null ? void 0 : _useContext.marker;
  const glyphContainer = (0, import_react.useMemo)(() => document.createElement("div"), []);
  (0, import_react.useEffect)(() => {
    var _advancedMarker$conte;
    if (!advancedMarker) {
      if (advancedMarker === void 0) {
        console.error("The <Pin> component can only be used inside <AdvancedMarker>.");
      }
      return;
    }
    if (props.glyph && props.children) {
      logErrorOnce("The <Pin> component only uses children to render the glyph if both the glyph property and children are present.");
    }
    if (import_react.Children.count(props.children) > 1) {
      logErrorOnce("Passing multiple children to the <Pin> component might lead to unexpected results.");
    }
    const pinViewOptions = _extends({}, props);
    const pinElement = new google.maps.marker.PinElement(pinViewOptions);
    if (props.children) {
      pinElement.glyph = glyphContainer;
    }
    const markerContent = (_advancedMarker$conte = advancedMarker.content) == null || (_advancedMarker$conte = _advancedMarker$conte.firstChild) == null ? void 0 : _advancedMarker$conte.firstChild;
    while (markerContent != null && markerContent.firstChild) {
      markerContent.removeChild(markerContent.firstChild);
    }
    if (markerContent) {
      markerContent.appendChild(pinElement.element);
    }
  }, [advancedMarker, glyphContainer, props]);
  return (0, import_react_dom.createPortal)(props.children, glyphContainer);
};
var mapLinear = (x, a1, a2, b1, b2) => b1 + (x - a1) * (b2 - b1) / (a2 - a1);
var getMapMaxTilt = (zoom) => {
  if (zoom <= 10) {
    return 30;
  }
  if (zoom >= 15.5) {
    return 67.5;
  }
  if (zoom <= 14) {
    return mapLinear(zoom, 10, 14, 30, 45);
  }
  return mapLinear(zoom, 14, 15.5, 45, 67.5);
};
var limitTiltRange = ({
  viewState
}) => {
  const pitch = viewState.pitch;
  const gmZoom = viewState.zoom + 1;
  const maxTilt = getMapMaxTilt(gmZoom);
  return _extends({}, viewState, {
    fovy: 25,
    pitch: Math.min(maxTilt, pitch)
  });
};
export {
  APILoadingStatus,
  APIProvider,
  APIProviderContext,
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  AdvancedMarkerContext,
  CollisionBehavior,
  ColorScheme,
  ControlPosition,
  GoogleMapsContext,
  InfoWindow,
  Map,
  MapControl,
  Marker,
  Pin,
  RenderingType,
  StaticMap,
  createStaticMapsUrl,
  isAdvancedMarker,
  isLatLngLiteral,
  latLngEquals,
  limitTiltRange,
  toLatLngLiteral,
  useAdvancedMarkerRef,
  useApiIsLoaded,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
  useMarkerRef
};
//# sourceMappingURL=@vis__gl_react-google-maps.js.map

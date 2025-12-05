// State management

const state = {
    currentWeek: null,
    currentYear: null,
    selectedDay: null,
    menus: new Map(),
    loading: new Set(),
    errors: new Map()
};

const listeners = new Set();

export function getState() {
    return state;
}

export function setState(updates) {
    Object.assign(state, updates);
    notifyListeners();
}

export function updateMenu(restaurantId, menu) {
    state.menus.set(restaurantId, menu);
    notifyListeners();
}

export function setLoading(restaurantId, isLoading) {
    if (isLoading) {
        state.loading.add(restaurantId);
    } else {
        state.loading.delete(restaurantId);
    }
    notifyListeners();
}

export function setError(restaurantId, error) {
    if (error) {
        state.errors.set(restaurantId, error);
    } else {
        state.errors.delete(restaurantId);
    }
    notifyListeners();
}

export function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function notifyListeners() {
    listeners.forEach(listener => listener(state));
}

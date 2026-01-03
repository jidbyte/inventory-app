function createSidebar() {
	let isOpen = $state(true);

	return {
		get isOpen() {
			return isOpen;
		},
		toggle: () => {
			isOpen = !isOpen;
		},
		setOpen: (open: boolean) => {
			isOpen = open;
		}
	};
}

export const sidebar = createSidebar();

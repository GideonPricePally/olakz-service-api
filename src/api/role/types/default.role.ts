export enum EDefaultUserRole {
  ANONYMOUS = 'anonymous',
  REGULAR_USER = 'regular.user',
  SINGLE_ARTIST = 'single.artiste',
  MANAGER = 'manager',
  ORGANIZATION = 'organization',
}

export const userRoles = [
  {
    value: EDefaultUserRole.ANONYMOUS,
    isExternalResource: false,
    displayName: 'Anonymous',
  },
  {
    value: EDefaultUserRole.REGULAR_USER,
    isExternalResource: true,
    displayName: 'Regular User',
  },
];

export enum EDefaultAdminRole {
  SUPER_ADMIN_ROLE = 'super.admin',
  BASIC_ADMIN_ROLE = 'basic.admin',
  VENDOR_ROLE = 'investor',
}

export function ServiceDataConstructor(code = '', name = '', description = '') {
  this.code = code
  this.name = name
  this.description = description
}

export function Service(
  // TODO: добавать пользователей в структуру
  idServices = null,
  idsNomenclatures = [],
  price = '',
  quantity = '',
  service_data = new ServiceDataConstructor()
) {
  this.id_services = idServices
  this.ids_nomenclatures = idsNomenclatures
  this.price = price
  this.quantity = quantity
  this.service_data = service_data
}

export function TaskData(
  notes = '',
  idsUsers = [],
  idObject = null,
  services = [],
  status = 'request'
) {
  this.notes = notes
  this.ids_users = idsUsers
  this.id_object = idObject
  this.services = services
  this.status = status
}

export function FavoriteNomenclature(
  idObject = null,
  idUser = null,
  idNomenclature = null
) {
  this.id_object = idObject
  this.id_user = idUser
  this.id_nomenclature = idNomenclature
}

export function MtoMUsersServices(id_services = null, price = '') {
  this.id_services = id_services
  this.price = price
}

export function MtoMUsersServicesQuery(
  id_user = null,
  id_services = null,
  once_entry = false,
  name = null
) {
  this.id_user = id_user
  this.id_services = id_services
  this.once_entry = once_entry
  this.name = name
}

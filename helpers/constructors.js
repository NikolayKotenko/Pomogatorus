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
  quantity = null,
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

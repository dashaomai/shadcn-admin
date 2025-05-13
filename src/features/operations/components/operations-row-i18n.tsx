import { Base64 } from 'js-base64'
import { useTranslation } from 'react-i18next'
import { DataTableRowActionsProps } from '@/lib/list-app'
import { OperationInfo } from '../data/operation'

type Props = DataTableRowActionsProps<OperationInfo>

export function OperationsRowI18n({ row }: Props) {
  const { t } = useTranslation()

  const params = JSON.parse(Base64.decode(row.original.params))

  return (
    <p className='w-fit'>
      {t(`apps.operations.i18n.${row.original.i18n}`, params)}
    </p>
  )
}

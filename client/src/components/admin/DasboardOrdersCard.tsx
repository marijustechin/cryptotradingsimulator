export const DashboardOrdersCard = ({title, value}:{title: string, value: number | string}) => {
    return (
        <div className="bg-gray-800 rounded-xl p-4 shadow ">
          <div className="text-gray-400 text-sm text-center">{title}</div>
          <div className="text-white text-2xl font-semibold text-center">
            {value}
          </div>
        </div>
    )
};
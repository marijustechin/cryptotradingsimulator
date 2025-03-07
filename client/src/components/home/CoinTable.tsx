export const CoinTable = () => {

    return (
        <>
            <div className="flex mx-auto text-white gap-3 pt-5 coin-table mb-30 relative z-15">
                <div className="grid grid-cols-4 bg-[#1A1B23] mx-auto justify-center py-10 rounded-[25px] text-center lg:text-[35px] md:text-[25px]">
                        <p className="">Name</p>
                        <p className="">Price</p>
                        <p className="">Percentage</p>
                        <p className="">Chart</p>
                </div>
            </div>
        </>
    )

}
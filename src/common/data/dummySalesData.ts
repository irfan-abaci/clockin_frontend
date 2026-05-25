import dayjs from 'dayjs';

const data: {
	id: number;
	name: string;
	office_name: string;
	site_name:string;
	company_name:string;
	price: number;
	count: number;
	date: dayjs.Dayjs;
}[] = [
	{
		id: 1,
		name: 'Amal R',
		office_name: 'Abaci',
		site_name:"Site 1",
		company_name:"Transit",
		price: 36,
		count: 982,
		date: dayjs(),
	},
	{
		id: 2,
		name: 'Sharoon varghees',
		office_name: 'Abaci',
		company_name:"Transit",
		price: 32,
		site_name:"Site 2",
		count: 423,
		date: dayjs().add(-1, 'day'),
	},
	{
		id: 3,
		name: 'Anuraj',
		office_name: 'Abaci',
		site_name:"Site 3",
		company_name:"Transit",
		price: 24,
		count: 678,
		date: dayjs().add(-1, 'day'),
	},
	{
		id: 4,
		name: 'Athira',
		office_name: 'Abaci',
		company_name:"Transit",
		site_name:"Site 4",
		price: 24,
		count: 532,
		date: dayjs().add(-2, 'day'),
	},
	{
		id: 5,
		name: 'Fuad',
		office_name: 'Abaci',
		company_name:"Company A",
		site_name:"Site 5",
		price: 74,
		count: 235,
		date: dayjs().add(-3, 'day'),
	},
	{
		id: 6,
		name: 'Salman',
		company_name:"Transit",
		office_name: 'Abaci',
		site_name:"Site 6",
		price: 58,
		count: 547,
		date: dayjs().add(-3, 'day'),
	},
	{
		id: 7,
		name: 'Shibin',
		company_name:"Transit ",
		office_name: 'Abaci',
		site_name:"Site 6",
		price: 58,
		count: 547,
		date: dayjs().add(-3, 'day'),
	},

];
export default data;

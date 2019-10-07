export const getMockedLotByField = (fieldOption) => {
  const user = mockedLotsFromDB.find(u => u[Object.keys(fieldOption)[0]] === Object.values(fieldOption)[0]);
  return user ? {...user} : undefined;
};

export const mockedLotsFromDB = [
  { id: 1,
    title: 'Chicken',
    image: 'marketing_lead.jpg',
    description:
      'Et modi et quia voluptas cum dolorem qui eos. Velit saepe cupiditate soluta ea et ' +
      'aliquam sit. Fugit dolor nihil in rerum tenetur illo aperiam dolorum porro.',
    status: 'inProcess',
    currentPrice: 63,
    estimatedPrice: 1584,
    startTime: '2019-10-04T10:44:49.238Z',
    endTime: '2019-10-15T12:59:17.471Z',
    user: null,
    bids: [],
  },
  { id: 101,
    title: 'Salad',
    image: 'connect.jpg',
    description:
      'Praesentium voluptas deleniti consectetur iste. Ex voluptas voluptas aliquid. Fugiat ut quae optio natus.',
    status: 'inProcess',
    currentPrice: 820,
    estimatedPrice: 2618,
    startTime: '2019-10-06T21:42:53.437Z',
    endTime: '2019-10-23T06:04:49.836Z',
    user: null,
    bids: [],
  },
  {
    id: 27,
    title: 'Towels',
    image: 'health.jpg',
    description:
      'Id in officia dolore. Ut facere rerum omnis facilis esse accusamus esse et. Dolor qui nobis fuga ex est nisi reprehenderit.',
    status: 'inProcess',
    currentPrice: 251,
    estimatedPrice: 3028,
    startTime: '2019-10-08T07:25:02.972Z',
    endTime: '2019-10-19T16:16:26.339Z',
    user: null,
    bids: [],
  },
  {
    id: 135,
    title: 'Car',
    image: 'haptic_adp_cross_platform.jpg',
    description:
      'Sint quia quod ipsam consequatur iusto veniam id consequatur. Quia rerum nihil quo nihil architecto culpa enim. Sit ducimus ipsum.',
    status: 'inProcess',
    currentPrice: 147,
    estimatedPrice: 1614,
    startTime: '2019-10-05T11:56:27.968Z',
    endTime: '2019-10-15T00:07:09.320Z',
    user: null,
    bids: [],
  },
  {
    id: 39,
    title: 'Keyboard',
    image: 'fuchsia_navigating.jpg',
    description:
      'Reprehenderit aliquid quis aut aspernatur quia vel ipsum enim. Dolor quaerat sit et omnis adipisci nemo omnis consequatur. ' +
      'Non molestiae eos nihil id aut est. ' +
      'Quos ipsum perspiciatis quaerat. Doloremque in reprehenderit qui.',
    status: 'inProcess',
    currentPrice: 921,
    estimatedPrice: 3661,
    startTime: '2019-10-08T07:36:19.679Z',
    endTime: '2019-10-28T05:46:09.054Z',
    user: null,
    bids: [],
  },
  { id: 33,
    title: 'Tuna',
    image: 'agent_frictionless_usb.jpg',
    description:
      'Sit ea facere ratione eum blanditiis. Sed molestiae sit et. Molestias voluptas et. Accusamus consequatur aliquam recusandae magni ' +
      'enim rerum quia voluptatum. Eos architecto cum qui dolore nobis architecto molestias aspernatur sit. Aut deserunt architecto voluptatem ' +
      'suscipit dignissimos facilis.',
    status: 'inProcess',
    currentPrice: 114,
    estimatedPrice: 7612,
    startTime: '2019-10-04T21:04:26.718Z',
    endTime: '2019-11-02T16:44:00.039Z',
    user: null,
    bids: [] },
  { id: 12,
    title: 'Chicken',
    image: 'inverse_compress.jpg',
    description:
      'Voluptas ullam quia quia debitis voluptas et maxime. Neque hic ea sunt. Minus totam voluptate asperiores placeat veniam voluptate et ' +
      'voluptatum.',
    status: 'inProcess',
    currentPrice: 551,
    estimatedPrice: 5048,
    startTime: '2019-10-05T00:32:34.267Z',
    endTime: '2019-10-21T09:37:37.971Z',
    user: null,
    bids: [] },
  { id: 98,
    title: 'Gloves',
    image: 'soap_generic_cutting_edge.jpg',
    description:
      'Aliquam unde voluptatibus vel sit consequatur ducimus. Architecto unde itaque et quidem in odit accusantium. Suscipit perspiciatis' +
      ' minima praesentium optio laudantium libero dolores. Autem optio quia ut quia dolorum rerum sequi. Vero et ea quam in tenetur aut' +
      ' omnis dolorem quia. Fugit saepe similique.',
    status: 'inProcess',
    currentPrice: 398,
    estimatedPrice: 9381,
    startTime: '2019-10-07T12:35:53.191Z',
    endTime: '2019-11-04T12:50:09.119Z',
    user: null,
    bids: [] },
  { id: 64,
    title: 'Car',
    image: 'turquoise_tools_wallis_and_futuna.jpg',
    description:
      'Ut saepe officiis. Excepturi sed voluptatem placeat provident qui. Dolore non doloribus odio repellat iusto voluptatem ad omnis. ' +
      'Nostrum dignissimos hic error neque. Qui molestias sint.',
    status: 'inProcess',
    currentPrice: 759,
    estimatedPrice: 9705,
    startTime: '2019-10-06T11:47:00.773Z',
    endTime: '2019-11-01T02:58:32.686Z',
    user: null,
    bids: [] },
  { id: 104,
    title: 'Gloves',
    image: 'frozen_liberia_togo.jpg',
    description:
      'Est velit voluptatum sunt possimus et. Quisquam soluta alias nesciunt corrupti aut nihil et quia ipsa. Nobis temporibus adipisci ' +
      'ratione rerum fugit at eius.',
    status: 'inProcess',
    currentPrice: 379,
    estimatedPrice: 3777,
    startTime: '2019-10-04T02:50:38.343Z',
    endTime: '2019-10-28T23:11:42.591Z',
    user: null,
    bids: [] },
  { id: 46,
    title: 'Pizza',
    image: 'fish_green.jpg',
    description:
      'Sed delectus enim nulla corporis corrupti aut ratione sint. Minima culpa sed minima perspiciatis sint fuga. Voluptatibus reiciendis' +
      ' labore est velit facilis delectus mollitia alias. Ipsum hic quisquam illo beatae repellendus iste corrupti culpa fugit. At nam enim.' +
      ' Dolores beatae minima rerum doloremque odio.',
    status: 'inProcess',
    currentPrice: 371,
    estimatedPrice: 2856,
    startTime: '2019-10-09T04:00:33.543Z',
    endTime: '2019-10-17T22:39:44.684Z',
    user: null,
    bids: [] },
  { id: 125,
    title: 'Soap',
    image: 'rss.jpg',
    description:
      'Facilis harum quo voluptatum et quaerat. Earum culpa dolore. Nemo molestiae iure magni et voluptatem non assumenda perspiciatis.',
    status: 'inProcess',
    currentPrice: 163,
    estimatedPrice: 8510,
    startTime: '2019-10-08T14:21:40.214Z',
    endTime: '2019-10-26T10:41:07.986Z',
    user: null,
    bids: [] },
  { id: 140,
    title: 'Pizza',
    image: 'toys.jpg',
    description:
      'Libero sapiente ipsa quaerat fugiat culpa accusamus nihil necessitatibus aut. ' +
      'Expedita harum illo omnis consectetur quia et ipsam eos voluptatem. Id iste possimus. ' +
      'Temporibus ut qui odio. Ratione amet quaerat omnis voluptates voluptas aliquid consequatur.',
    status: 'inProcess',
    currentPrice: 290,
    estimatedPrice: 1080,
    startTime: '2019-10-09T17:25:39.195Z',
    endTime: '2019-10-31T13:56:28.517Z',
    user: null,
    bids: [] },
  { id: 13,
    title: 'Hat',
    image: 'bottom_line.jpg',
    description:
      'Aliquam eaque aut excepturi corporis dolor aliquid non molestias ut. Quo ' +
      'nihil praesentium exercitationem aut expedita voluptas dolorem. Minima similique ' +
      'quia dolorem nobis ex eaque deleniti. Earum deserunt quidem quia esse libero vitae et. Nisi sint qui vero voluptates.',
    status: 'inProcess',
    currentPrice: 751,
    estimatedPrice: 4193,
    startTime: '2019-10-04T13:54:25.018Z',
    endTime: '2019-10-21T09:37:16.737Z',
    user: null,
    bids: [] },
  { id: 21,
    title: 'Salad',
    image: 'innovate_back_end_synergize.jpg',
    description:
      'Accusantium voluptate consequuntur cupiditate sit dolor. Consequatur odit nobis magnam expedita. Non dolor corrupti velit ' +
      'reiciendis eos qui.',
    status: 'inProcess',
    currentPrice: 486,
    estimatedPrice: 4097,
    startTime: '2019-10-07T12:06:23.666Z',
    endTime: '2019-11-05T18:51:40.940Z',
    user: null,
    bids: [] },
  { id: 112,
    title: 'Bacon',
    image: 'invoice.jpg',
    description:
      'Expedita perspiciatis laudantium consequuntur. Rem optio rerum consequatur perspiciatis qui distinctio accusantium temporibus ' +
      'inventore. Architecto quaerat pariatur ratione in delectus. Optio incidunt eum ullam.',
    status: 'inProcess',
    currentPrice: 850,
    estimatedPrice: 4137,
    startTime: '2019-10-08T08:12:54.617Z',
    endTime: '2019-10-30T20:14:41.900Z',
    user: null,
    bids: [] },
  { id: 85,
    title: 'Bacon',
    image: 'international.jpg',
    description:
      'Qui cupiditate aut sequi. Ut aperiam qui fugit et. Dolores pariatur molestiae unde minima impedit nam earum dolor aut.',
    status: 'inProcess',
    currentPrice: 639,
    estimatedPrice: 6488,
    startTime: '2019-10-04T13:32:18.455Z',
    endTime: '2019-10-17T12:10:15.138Z',
    user: null,
    bids: [] },
  { id: 32,
    title: 'Computer',
    image: 'washington_west_virginia.jpg',
    description:
      'Fuga et eum laborum itaque modi. Architecto aliquam quis ut nihil est id dicta alias non. Repudiandae debitis natus maxime nobis ' +
      'voluptatem. Labore et veritatis eveniet iure est nisi. Quo delectus voluptatem debitis eligendi voluptatem mollitia.',
    status: 'inProcess',
    currentPrice: 107,
    estimatedPrice: 6248,
    startTime: '2019-10-07T11:50:49.247Z',
    endTime: '2019-10-30T10:38:09.247Z',
    user: null,
    bids: [] },
  { id: 113,
    title: 'Salad',
    image: 'enable.jpg',
    description:
      'Atque quia consequatur maiores. Et itaque et delectus aut quis. In iure quos odit nam non non accusamus culpa est.',
    status: 'inProcess',
    currentPrice: 573,
    estimatedPrice: 5757,
    startTime: '2019-10-04T04:43:05.318Z',
    endTime: '2019-10-20T03:17:19.176Z',
    user: null,
    bids: [] },
  { id: 128,
    title: 'Hat',
    image: 'parse.jpg',
    description:
      'Aut aut eos. Autem optio necessitatibus maiores harum reiciendis voluptatem ut delectus nostrum. Qui ullam enim. Ratione eos et' +
      ' consequatur non.',
    status: 'inProcess',
    currentPrice: 781,
    estimatedPrice: 6588,
    startTime: '2019-10-05T16:29:13.244Z',
    endTime: '2019-10-19T11:44:28.302Z',
    user: null,
    bids: [] },
  { id: 38,
    title: 'Salad',
    image: 'awesome_steel_fish_colorado.jpg',
    description:
      'Rerum aut distinctio et voluptas nihil. Blanditiis temporibus natus iusto. Laudantium qui ipsa ratione ut nostrum et. Qui' +
      ' voluptas nihil est architecto modi blanditiis. Consequatur rem pariatur est soluta iusto. Aut ducimus eius ipsum ut consequatur.',
    status: 'inProcess',
    currentPrice: 217,
    estimatedPrice: 1015,
    startTime: '2019-10-07T13:09:30.051Z',
    endTime: '2019-10-12T13:48:01.770Z',
    user: null,
    bids: [] },
  { id: 99,
    title: 'Salad',
    image: 'impactful.jpg',
    description:
      'Quis sunt vitae qui laborum fuga. Est voluptatum vero exercitationem corrupti ut sed. Qui eum fugit exercitationem explicabo' +
      ' quaerat. Repellat itaque maiores fugiat rerum.',
    status: 'inProcess',
    currentPrice: 98,
    estimatedPrice: 5375,
    startTime: '2019-10-06T05:21:03.105Z',
    endTime: '2019-11-06T00:37:17.454Z',
    user: null,
    bids: [] },
  { id: 94,
    title: 'Chips',
    image: 'deposit_sql.jpg',
    description:
      'Cupiditate maxime dolores distinctio cum. Ipsa culpa non error deserunt repellendus. Nulla unde quis rerum temporibus' +
      ' enim exercitationem voluptate culpa eum.',
    status: 'inProcess',
    currentPrice: 570,
    estimatedPrice: 7588,
    startTime: '2019-10-05T18:59:59.167Z',
    endTime: '2019-10-27T14:47:17.518Z',
    user: null,
    bids: [] },
  { id: 95,
    title: 'Pants',
    image: 'reverse_engineered_steel_quality_focused.jpg',
    description:
      'Enim magnam blanditiis cumque velit nisi. Occaecati dolorem aut consequatur. Officia voluptatibus aperiam voluptate dolores' +
      ' dolorum eligendi et sunt beatae.',
    status: 'inProcess',
    currentPrice: 474,
    estimatedPrice: 1609,
    startTime: '2019-10-05T00:04:54.903Z',
    endTime: '2019-10-28T06:11:56.615Z',
    user: null,
    bids: [] },
  { id: 62,
    title: 'Towels',
    image: 'productize_corporate.jpg',
    description:
      'Molestias non adipisci nostrum. Fugiat facere est aut et dolor tempora ipsam. Vero necessitatibus vitae a. Quo suscipit dolorum' +
      ' numquam quia corrupti ut ab. Corporis ut dolor. Id accusantium harum libero saepe soluta.',
    status: 'inProcess',
    currentPrice: 948,
    estimatedPrice: 1436,
    startTime: '2019-10-10T01:01:16.902Z',
    endTime: '2019-10-16T14:27:20.575Z',
    user: null,
    bids: [] },
  { id: 97,
    title: 'Bike',
    image: 'village_lead.jpg',
    description:
      'Asperiores rerum eum adipisci accusantium. Maiores quia optio optio ipsum quia. Ratione praesentium cumque laboriosam incidunt ' +
      'est atque aspernatur at sapiente. Id minus et eius et voluptates maxime corporis rerum.',
    status: 'inProcess',
    currentPrice: 547,
    estimatedPrice: 8332,
    startTime: '2019-10-05T12:34:24.856Z',
    endTime: '2019-10-31T05:55:01.054Z',
    user: null,
    bids: [] },
  { id: 126,
    title: 'Salad',
    image: 'money_market_account_open_source_cambridgeshire.jpg',
    description:
      'Itaque voluptatem ratione enim nemo eum occaecati repellendus. Voluptas aut eius aspernatur a ut corporis commodi. Aliquid dolore' +
      ' libero occaecati. Et repellat porro. Architecto voluptatem nobis nobis fugit ipsum necessitatibus inventore.',
    status: 'inProcess',
    currentPrice: 898,
    estimatedPrice: 2741,
    startTime: '2019-10-09T13:30:49.797Z',
    endTime: '2019-10-19T23:15:02.607Z',
    user: null,
    bids: [] },
  { id: 67,
    title: 'Table',
    image: 'distributed.jpg',
    description:
      'Perferendis dolor magni ut. Porro eum est recusandae vel est saepe maiores explicabo. Ut deserunt omnis fugiat explicabo saepe odit ' +
      'unde numquam. Qui fugit molestiae excepturi adipisci et rerum provident.',
    status: 'inProcess',
    currentPrice: 120,
    estimatedPrice: 2181,
    startTime: '2019-10-08T11:49:28.701Z',
    endTime: '2019-11-02T17:03:43.346Z',
    user: null,
    bids: [] },
  { id: 134,
    title: 'Gloves',
    image: 'functionalities_avon_director.jpg',
    description:
      'Nam et soluta non est neque alias dolores. Aliquam sit quo quam quia minus qui eaque omnis sunt. Nobis numquam id veniam.',
    status: 'inProcess',
    currentPrice: 622,
    estimatedPrice: 4032,
    startTime: '2019-10-06T17:04:05.943Z',
    endTime: '2019-10-20T13:43:39.324Z',
    user: null,
    bids: [] },
  { id: 116,
    title: 'Keyboard',
    image: 'cambodia.jpg',
    description:
      'Tempore debitis placeat non. Id excepturi aut repudiandae illo voluptatem. Aperiam distinctio quia vel vel molestias. Similique maxime ' +
      'in voluptatum. Atque libero itaque nesciunt et. Praesentium harum qui molestiae sed excepturi quae totam.',
    status: 'inProcess',
    currentPrice: 674,
    estimatedPrice: 1982,
    startTime: '2019-10-05T03:32:45.496Z',
    endTime: '2019-10-24T19:51:21.541Z',
    user: null,
    bids: [] },
  { id: 84,
    title: 'Chicken',
    image: 'networked_digital_handmade.jpg',
    description:
      'Dignissimos consequuntur eligendi ut. Voluptatem ut explicabo magni pariatur ducimus sit numquam. Laborum eligendi saepe ' +
      'sed ratione officiis voluptatem dicta. Corporis maxime aperiam provident cum dolorem corrupti et facere.',
    status: 'inProcess',
    currentPrice: 184,
    estimatedPrice: 2962,
    startTime: '2019-10-08T03:26:25.902Z',
    endTime: '2019-10-14T09:26:30.318Z',
    user: null,
    bids: [] },
  { id: 23,
    title: 'Salad',
    image: 'ai_generating_azure.jpg',
    description:
      'Laudantium quasi minima qui repellat eligendi aut amet. Sint placeat consequatur enim accusantium aut et est quidem. ' +
      'Et esse commodi harum ut. Sapiente consequatur maxime voluptas omnis. Adipisci tenetur quaerat eligendi fugit.',
    status: 'inProcess',
    currentPrice: 551,
    estimatedPrice: 3014,
    startTime: '2019-10-08T02:48:03.047Z',
    endTime: '2019-10-31T11:57:05.013Z',
    user: null,
    bids: [] },
  { id: 44,
    title: 'Fish',
    image: 'reinvent.jpg',
    description:
      'Saepe maxime eum aut laboriosam explicabo nesciunt. Omnis ratione atque dolore veritatis quisquam. Eveniet eum est facere harum.',
    status: 'inProcess',
    currentPrice: 866,
    estimatedPrice: 2891,
    startTime: '2019-10-10T00:12:24.603Z',
    endTime: '2019-11-05T06:17:06.576Z',
    user: null,
    bids: [] },
  { id: 111,
    title: 'Shoes',
    image: 'senior.jpg',
    description:
      'Debitis cumque enim. Placeat ut dolorum repudiandae esse necessitatibus tempore. Et nesciunt iusto expedita non tempora possimus sed fugiat.' +
      ' Architecto laborum et. Voluptates ex enim nostrum voluptas sed sint beatae repellat incidunt.',
    status: 'inProcess',
    currentPrice: 726,
    estimatedPrice: 6461,
    startTime: '2019-10-08T09:45:13.929Z',
    endTime: '2019-11-01T05:23:34.040Z',
    user: null,
    bids: [] },
  { id: 49,
    title: 'Towels',
    image: 'calculate_turquoise.jpg',
    description:
      'Et reiciendis recusandae rerum sit dicta similique accusamus sint. Blanditiis quia quam. Et accusamus repellendus dolorem sapiente unde at.',
    status: 'inProcess',
    currentPrice: 54,
    estimatedPrice: 2751,
    startTime: '2019-10-06T03:53:28.296Z',
    endTime: '2019-10-19T22:42:43.938Z',
    user: null,
    bids: [] },
  { id: 45,
    title: 'Cheese',
    image: 'small_wooden_salad_dynamic_e_enable.jpg',
    description:
      'Quaerat delectus assumenda dicta voluptatibus veritatis qui doloribus et sapiente. Quis vel cumque dolores nobis. Iusto non nam neque quas.',
    status: 'inProcess',
    currentPrice: 305,
    estimatedPrice: 1126,
    startTime: '2019-10-08T12:54:00.855Z',
    endTime: '2019-10-25T01:48:40.752Z',
    user: null,
    bids: [] },
  { id: 75,
    title: 'Salad',
    image: 'teal_dynamic_bedfordshire.jpg',
    description:
      'Quo accusamus voluptates. Accusantium velit vero voluptatum non dicta provident quia omnis est. Iure rerum in quod ad. Praesentium omnis' +
      ' eveniet maiores perferendis qui. Et dolore suscipit molestiae possimus aliquid est aliquid.',
    status: 'inProcess',
    currentPrice: 728,
    estimatedPrice: 5214,
    startTime: '2019-10-07T23:00:12.012Z',
    endTime: '2019-10-13T06:29:38.465Z',
    user: null,
    bids: [] },
  { id: 124,
    title: 'Gloves',
    image: 'checking_account.jpg',
    description:
      'Natus sit rerum. Laboriosam est quos aut praesentium voluptatem soluta et. Placeat autem eum adipisci. Unde eos quo at aut ea deleniti' +
      ' ipsum cupiditate excepturi. Molestiae ut vel asperiores. Dolorem dolore sapiente praesentium non similique qui vel.',
    status: 'inProcess',
    currentPrice: 297,
    estimatedPrice: 9247,
    startTime: '2019-10-06T06:39:21.114Z',
    endTime: '2019-10-14T03:33:51.287Z',
    user: null,
    bids: [] },
  { id: 43,
    title: 'Pizza',
    image: 'invoice.jpg',
    description:
      'Est cum dolorem vel ipsum. Qui commodi officia non. Quae tempora natus harum id harum facere occaecati. Doloribus sed consectetur' +
      ' repellendus culpa. Quia reiciendis libero nemo sunt qui ut quam ea. Itaque non omnis et blanditiis incidunt illo laborum dignissimos.',
    status: 'inProcess',
    currentPrice: 756,
    estimatedPrice: 4271,
    startTime: '2019-10-08T06:49:26.396Z',
    endTime: '2019-11-01T12:27:46.879Z',
    user: null,
    bids: [] },
  { id: 14,
    title: 'Bacon',
    image: 'assurance_frozen_non_volatile.jpg',
    description:
      'Vitae distinctio minus architecto. Cupiditate dolorem voluptas recusandae ' +
      'magni a voluptatem commodi nam debitis. Ad aspernatur quia veritatis eligendi reiciendis consequatur voluptatem.',
    status: 'inProcess',
    currentPrice: 783,
    estimatedPrice: 9284,
    startTime: '2019-10-06T11:34:42.924Z',
    endTime: '2019-10-30T21:53:01.061Z',
    user: null,
    bids: [] },
  { id: 118,
    title: 'Bike',
    image: 'unbranded_rubber_ball.jpg',
    description:
      'Cupiditate amet dolorem. Distinctio ad odio recusandae recusandae.' +
      ' A est accusantium in ut velit. Sint porro libero accusantium labore aut pariatur. Fugit laudantium consequuntur.',
    status: 'inProcess',
    currentPrice: 229,
    estimatedPrice: 4159,
    startTime: '2019-10-09T02:13:08.763Z',
    endTime: '2019-10-12T10:24:44.656Z',
    user: null,
    bids: [] },
  { id: 88,
    title: 'Fish',
    image: 'metrics_hacking.jpg',
    description:
      'Nihil rem sed et in qui. Deserunt recusandae ea eaque qui quasi quisquam. Sint consequuntur qui eaque et dolor. Provident repellat' +
      ' aut laboriosam vitae.',
    status: 'inProcess',
    currentPrice: 510,
    estimatedPrice: 5380,
    startTime: '2019-10-08T21:59:57.759Z',
    endTime: '2019-10-15T08:12:29.302Z',
    user: null,
    bids: [] },
  { id: 7,
    title: 'Shirt',
    image: 'somalia_central.jpg',
    description:
      'Voluptatem quisquam odit id ut magnam odit rem et. Maxime quos quisquam et id molestiae adipisci accusantium molestias nesciunt. ' +
      'Corporis atque harum voluptatem est quis est et. Et exercitationem quis saepe iste similique. Quia hic qui quo reiciendis ' +
      'aut aut harum fugiat.',
    status: 'inProcess',
    currentPrice: 974,
    estimatedPrice: 4726,
    startTime: '2019-10-04T15:50:45.565Z',
    endTime: '2019-11-05T12:58:18.408Z',
    user: null,
    bids: [],
  },
];

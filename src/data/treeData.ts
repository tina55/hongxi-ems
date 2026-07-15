import type { TreeNode } from '@/types/tree';

export const treeData: TreeNode[] = [
  {
    id: 'factory-1',
    name: '宏奥厂区',
    type: 'factory',
    parentId: null,
    children: [
      {
        id: 'workshop-1',
        name: '涂装车间',
        type: 'workshop',
        parentId: 'factory-1',
        children: [
          {
            id: 'coating-primer',
            name: '底漆线体',
            type: 'equipment',
            parentId: 'workshop-1',
            children: [
              {
                id: 'primer-refrigerator',
                name: '制冷机控制柜（TZZLJ12）',
                type: 'meter',
                meterType: 'electric',
                parentId: 'coating-primer',
                children: []
              },
              {
                id: 'primer-purewater',
                name: '纯水控制柜（TZCS07）',
                type: 'meter',
                meterType: 'electric',
                parentId: 'coating-primer',
                children: []
              }
            ]
          },
          {
            id: 'coating-topcoat',
            name: '面漆线',
            type: 'equipment',
            parentId: 'workshop-1',
            children: [
              {
                id: 'topcoat-ac1',
                name: '二楼喷漆室空调',
                type: 'meter',
                meterType: 'electric',
                parentId: 'coating-topcoat',
                children: []
              },
              {
                id: 'topcoat-ac2',
                name: '二楼调漆间空调',
                type: 'meter',
                meterType: 'electric',
                parentId: 'coating-topcoat',
                children: []
              },
              {
                id: 'topcoat-rto',
                name: 'RTO动力控制柜',
                type: 'meter',
                meterType: 'electric',
                parentId: 'coating-topcoat',
                children: []
              }
            ]
          },
          {
            id: 'meter-water-2',
            name: '涂装车间水表',
            type: 'meter',
            meterType: 'water',
            parentId: 'workshop-1',
            children: []
          },
          {
            id: 'meter-gas-2',
            name: '涂装车间天然气表',
            type: 'meter',
            meterType: 'gas',
            parentId: 'workshop-1',
            children: []
          },
          {
            id: 'meter-compressed-air-1',
            name: '涂装车间压缩空气表',
            type: 'meter',
            meterType: 'compressedAir',
            parentId: 'workshop-1',
            children: []
          },
          {
            id: 'meter-heat-1',
            name: '涂装车间热量表',
            type: 'meter',
            meterType: 'heat',
            parentId: 'workshop-1',
            children: []
          }
        ]
      },
      {
        id: 'workshop-2',
        name: '数控车间',
        type: 'workshop',
        parentId: 'factory-1',
        children: [
          {
            id: 'area-1',
            name: 'CNC加工区',
            type: 'equipment',
            parentId: 'workshop-2',
            children: [
              {
                id: 'meter-1',
                name: 'SCDL-001电表',
                type: 'meter',
                meterType: 'electric',
                parentId: 'area-1',
                children: []
              },
              {
                id: 'meter-2',
                name: 'SCDL-001-分电表',
                type: 'meter',
                meterType: 'electric',
                parentId: 'area-1',
                children: []
              }
            ]
          },
          {
            id: 'workshop-3',
            name: '激光区',
            type: 'equipment',
            parentId: 'workshop-2',
            children: [
              {
                id: 'laser-meter-1',
                name: '激光切割机电表',
                type: 'meter',
                meterType: 'electric',
                parentId: 'workshop-3',
                children: []
              }
            ]
          },
          {
            id: 'workshop-4',
            name: '压铆区',
            type: 'equipment',
            parentId: 'workshop-2',
            children: [
              {
                id: 'rivet-meter-1',
                name: '压铆机电表',
                type: 'meter',
                meterType: 'electric',
                parentId: 'workshop-4',
                children: []
              }
            ]
          },
          {
            id: 'meter-compressed-air-2',
            name: '数控车间压缩空气表',
            type: 'meter',
            meterType: 'compressedAir',
            parentId: 'workshop-2',
            children: []
          },
          {
            id: 'meter-co2-1',
            name: '数控车间二氧化碳气表',
            type: 'meter',
            meterType: 'co2',
            parentId: 'workshop-2',
            children: []
          }
        ]
      },
      {
        id: 'workshop-5',
        name: '冲压车间',
        type: 'workshop',
        parentId: 'factory-1',
        children: [
          {
            id: 'stamping-big',
            name: '大冲区（12）',
            type: 'equipment',
            parentId: 'workshop-5',
            children: [
              {
                id: 'big-press-meter',
                name: '大冲区总电表',
                type: 'meter',
                meterType: 'electric',
                parentId: 'stamping-big',
                children: []
              }
            ]
          },
          {
            id: 'stamping-small',
            name: '小冲区（5）',
            type: 'equipment',
            parentId: 'workshop-5',
            children: [
              {
                id: 'small-press-meter',
                name: '小冲区总电表',
                type: 'meter',
                meterType: 'electric',
                parentId: 'stamping-small',
                children: []
              }
            ]
          },
          {
            id: 'stamping-blanking',
            name: '下料区（2）',
            type: 'equipment',
            parentId: 'workshop-5',
            children: [
              {
                id: 'blanking-meter',
                name: '下料区电表',
                type: 'meter',
                meterType: 'electric',
                parentId: 'stamping-blanking',
                children: []
              }
            ]
          },
          {
            id: 'meter-compressed-air-3',
            name: '冲压车间压缩空气表',
            type: 'meter',
            meterType: 'compressedAir',
            parentId: 'workshop-5',
            children: []
          },
          {
            id: 'meter-water-4',
            name: '冲压车间水表',
            type: 'meter',
            meterType: 'water',
            parentId: 'workshop-5',
            children: []
          }
        ]
      },
      {
        id: 'workshop-6',
        name: 'V80车间',
        type: 'workshop',
        parentId: 'factory-1',
        children: [
          {
            id: 'v80-control',
            name: '控制配电柜（三岛区域）',
            type: 'equipment',
            parentId: 'workshop-6',
            children: [
              {
                id: 'v80-control-meter',
                name: '三岛区域电表',
                type: 'meter',
                meterType: 'electric',
                parentId: 'v80-control',
                children: []
              }
            ]
          },
          {
            id: 'v80-welding',
            name: '焊接电配电柜（货箱区）',
            type: 'equipment',
            parentId: 'workshop-6',
            children: [
              {
                id: 'v80-welding-meter',
                name: '货箱区电表',
                type: 'meter',
                meterType: 'electric',
                parentId: 'v80-welding',
                children: []
              }
            ]
          },
          {
            id: 'meter-compressed-air-4',
            name: 'V80车间压缩空气表',
            type: 'meter',
            meterType: 'compressedAir',
            parentId: 'workshop-6',
            children: []
          },
          {
            id: 'meter-argon-1',
            name: 'V80车间氩气表',
            type: 'meter',
            meterType: 'argon',
            parentId: 'workshop-6',
            children: []
          }
        ]
      },
      {
        id: 'workshop-7',
        name: '集成车间',
        type: 'workshop',
        parentId: 'factory-1',
        children: [
          {
            id: 'meter-3',
            name: 'UB线体产线电表',
            type: 'meter',
            meterType: 'electric',
            parentId: 'workshop-7',
            children: []
          },
          {
            id: 'meter-4',
            name: 'MB线体产线电表',
            type: 'meter',
            meterType: 'electric',
            parentId: 'workshop-7',
            children: []
          },
          {
            id: 'meter-5',
            name: '打磨房电表',
            type: 'meter',
            meterType: 'electric',
            parentId: 'workshop-7',
            children: []
          },
          {
            id: 'meter-water-3',
            name: '集成车间水表',
            type: 'meter',
            meterType: 'water',
            parentId: 'workshop-7',
            children: []
          },
          {
            id: 'meter-compressed-air-5',
            name: '集成车间压缩空气表',
            type: 'meter',
            meterType: 'compressedAir',
            parentId: 'workshop-7',
            children: []
          },
          {
            id: 'meter-argon-2',
            name: '集成车间氩气表',
            type: 'meter',
            meterType: 'argon',
            parentId: 'workshop-7',
            children: []
          }
        ]
      }
    ]
  }
];

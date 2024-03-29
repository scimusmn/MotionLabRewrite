
//////////////////////////////////////////////////////////////////////////
// PIXEL FORMATS
//////////////////////////////////////////////////////////////////////////
// Indicate if pixel is monochrome or RGB
#define GVSP_PIX_MONO								0x01000000
#define GVSP_PIX_RGB								0x02000000	// deprecated in version 1.1
#define GVSP_PIX_COLOR								0x02000000
#define GVSP_PIX_CUSTOM								0x80000000
#define GVSP_PIX_COLOR_MASK							0xFF000000

// Indicate effective number of bits occupied by the pixel(including padding).
// This can be used to compute amount of memory required to store an image.
#define GVSP_PIX_OCCUPY1BIT							0x00010000
#define GVSP_PIX_OCCUPY2BIT							0x00020000
#define GVSP_PIX_OCCUPY4BIT							0x00040000
#define GVSP_PIX_OCCUPY8BIT							0x00080000
#define GVSP_PIX_OCCUPY12BIT						0x000C0000
#define GVSP_PIX_OCCUPY16BIT						0x00100000
#define GVSP_PIX_OCCUPY24BIT						0x00180000
#define GVSP_PIX_OCCUPY32BIT						0x00200000
#define GVSP_PIX_OCCUPY36BIT						0x00240000
#define GVSP_PIX_OCCUPY48BIT						0x00300000
#define GVSP_PIX_EFFECTIVE_PIXEL_SIZE_MASK			0x00FF0000
#define GVSP_PIX_EFFECTIVE_PIXEL_SIZE_SHIFT			16

// Pixel ID: lower 16-bit of the pixel formats
#define GVSP_PIX_ID_MASK							0x0000FFFF
#define GVSP_PIX_COUNT								0x46		// next Pixel ID available

#define GVSP_PIX_MONO1P								(GVSP_PIX_MONO | GVSP_PIX_OCCUPY1BIT	| 0x0037)
#define GVSP_PIX_MONO2P								(GVSP_PIX_MONO | GVSP_PIX_OCCUPY2BIT	| 0x0038)
#define GVSP_PIX_MONO4P								(GVSP_PIX_MONO | GVSP_PIX_OCCUPY4BIT	| 0x0039)
#define GVSP_PIX_MONO8								(GVSP_PIX_MONO | GVSP_PIX_OCCUPY8BIT	| 0x0001)
#define GVSP_PIX_MONO8S								(GVSP_PIX_MONO | GVSP_PIX_OCCUPY8BIT	| 0x0002)
#define GVSP_PIX_MONO10								(GVSP_PIX_MONO | GVSP_PIX_OCCUPY16BIT	| 0x0003)
#define GVSP_PIX_MONO10_PACKED						(GVSP_PIX_MONO | GVSP_PIX_OCCUPY12BIT	| 0x0004)
#define GVSP_PIX_MONO12								(GVSP_PIX_MONO | GVSP_PIX_OCCUPY16BIT	| 0x0005)
#define GVSP_PIX_MONO12_PACKED						(GVSP_PIX_MONO | GVSP_PIX_OCCUPY12BIT	| 0x0006)
#define GVSP_PIX_MONO14								(GVSP_PIX_MONO | GVSP_PIX_OCCUPY16BIT	| 0x0025)
#define GVSP_PIX_MONO16								(GVSP_PIX_MONO | GVSP_PIX_OCCUPY16BIT	| 0x0007)

#define GVSP_PIX_BAYGR8								(GVSP_PIX_MONO | GVSP_PIX_OCCUPY8BIT	| 0x0008)
#define GVSP_PIX_BAYRG8								(GVSP_PIX_MONO | GVSP_PIX_OCCUPY8BIT	| 0x0009)
#define GVSP_PIX_BAYGB8								(GVSP_PIX_MONO | GVSP_PIX_OCCUPY8BIT	| 0x000A)
#define GVSP_PIX_BAYBG8								(GVSP_PIX_MONO | GVSP_PIX_OCCUPY8BIT	| 0x000B)
#define GVSP_PIX_BAYGR10							(GVSP_PIX_MONO | GVSP_PIX_OCCUPY16BIT	| 0x000C)
#define GVSP_PIX_BAYRG10							(GVSP_PIX_MONO | GVSP_PIX_OCCUPY16BIT	| 0x000D)
#define GVSP_PIX_BAYGB10							(GVSP_PIX_MONO | GVSP_PIX_OCCUPY16BIT	| 0x000E)
#define GVSP_PIX_BAYBG10							(GVSP_PIX_MONO | GVSP_PIX_OCCUPY16BIT	| 0x000F)
#define GVSP_PIX_BAYGR12							(GVSP_PIX_MONO | GVSP_PIX_OCCUPY16BIT	| 0x0010)
#define GVSP_PIX_BAYRG12							(GVSP_PIX_MONO | GVSP_PIX_OCCUPY16BIT	| 0x0011)
#define GVSP_PIX_BAYGB12							(GVSP_PIX_MONO | GVSP_PIX_OCCUPY16BIT	| 0x0012)
#define GVSP_PIX_BAYBG12							(GVSP_PIX_MONO | GVSP_PIX_OCCUPY16BIT	| 0x0013)
#define GVSP_PIX_BAYGR10_PACKED						(GVSP_PIX_MONO | GVSP_PIX_OCCUPY12BIT	| 0x0026)
#define GVSP_PIX_BAYRG10_PACKED						(GVSP_PIX_MONO | GVSP_PIX_OCCUPY12BIT	| 0x0027)
#define GVSP_PIX_BAYGB10_PACKED						(GVSP_PIX_MONO | GVSP_PIX_OCCUPY12BIT	| 0x0028)
#define GVSP_PIX_BAYBG10_PACKED						(GVSP_PIX_MONO | GVSP_PIX_OCCUPY12BIT	| 0x0029)
#define GVSP_PIX_BAYGR12_PACKED						(GVSP_PIX_MONO | GVSP_PIX_OCCUPY12BIT	| 0x002A)
#define GVSP_PIX_BAYRG12_PACKED						(GVSP_PIX_MONO | GVSP_PIX_OCCUPY12BIT	| 0x002B)
#define GVSP_PIX_BAYGB12_PACKED						(GVSP_PIX_MONO | GVSP_PIX_OCCUPY12BIT	| 0x002C)
#define GVSP_PIX_BAYBG12_PACKED						(GVSP_PIX_MONO | GVSP_PIX_OCCUPY12BIT	| 0x002D)
#define GVSP_PIX_BAYGR16							(GVSP_PIX_MONO | GVSP_PIX_OCCUPY16BIT	| 0x002E)
#define GVSP_PIX_BAYRG16							(GVSP_PIX_MONO | GVSP_PIX_OCCUPY16BIT	| 0x002F)
#define GVSP_PIX_BAYGB16							(GVSP_PIX_MONO | GVSP_PIX_OCCUPY16BIT	| 0x0030)
#define GVSP_PIX_BAYBG16							(GVSP_PIX_MONO | GVSP_PIX_OCCUPY16BIT	| 0x0031)

#define GVSP_PIX_RGB8								(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY24BIT	| 0x0014)
#define GVSP_PIX_BGR8								(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY24BIT	| 0x0015)
#define GVSP_PIX_RGB8A								(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY32BIT	| 0x0016)
#define GVSP_PIX_BGR8A								(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY32BIT	| 0x0017)
#define GVSP_PIX_RGB10								(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY48BIT	| 0x0018)
#define GVSP_PIX_BGR10								(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY48BIT	| 0x0019)
#define GVSP_PIX_RGB12								(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY48BIT	| 0x001A)
#define GVSP_PIX_BGR12								(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY48BIT	| 0x001B)
#define GVSP_PIX_RGB16								(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY48BIT	| 0x0033)
#define GVSP_PIX_RGB10V1_PACKED						(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY32BIT	| 0x001C)
#define GVSP_PIX_RGB10P32							(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY32BIT	| 0x001D)
#define GVSP_PIX_RGB12V1_PACKED						(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY36BIT	| 0x0034)
#define GVSP_PIX_RGB565P							(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY16BIT	| 0x0035)
#define GVSP_PIX_BGR565P							(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY16BIT	| 0x0036)

#define GVSP_PIX_YUV411_8_UYYVYY					(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY12BIT	| 0x001E)
#define GVSP_PIX_YUV422_8_UYVY						(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY16BIT	| 0x001F)
#define GVSP_PIX_YUV422_8							(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY16BIT	| 0x0032)
#define GVSP_PIX_YUV8_UYV							(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY24BIT	| 0x0020)
#define GVSP_PIX_YCBCR8_CBYCR						(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY24BIT	| 0x003A)
#define GVSP_PIX_YCBCR422_8							(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY16BIT	| 0x003B)
#define GVSP_PIX_YCBCR422_8_CBYCRY					(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY16BIT	| 0x0043)
#define GVSP_PIX_YCBCR411_8_CBYYCRYY				(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY12BIT	| 0x003C)
#define GVSP_PIX_YCBCR601_8_CBYCR					(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY24BIT	| 0x003D)
#define GVSP_PIX_YCBCR601_422_8						(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY16BIT	| 0x003E)
#define GVSP_PIX_YCBCR601_422_8_CBYCRY				(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY16BIT	| 0x0044)
#define GVSP_PIX_YCBCR601_411_8_CBYYCRYY			(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY12BIT	| 0x003F)
#define GVSP_PIX_YCBCR709_8_CBYCR					(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY24BIT	| 0x0040)
#define GVSP_PIX_YCBCR709_422_8						(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY16BIT	| 0x0041)
#define GVSP_PIX_YCBCR709_422_8_CBYCRY				(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY16BIT	| 0x0045)
#define GVSP_PIX_YCBCR709_411_8_CBYYCRYY			(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY12BIT	| 0x0042)

#define GVSP_PIX_RGB8_PLANAR						(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY24BIT	| 0x0021)
#define GVSP_PIX_RGB10_PLANAR						(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY48BIT	| 0x0022)
#define GVSP_PIX_RGB12_PLANAR						(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY48BIT	| 0x0023)
#define GVSP_PIX_RGB16_PLANAR						(GVSP_PIX_COLOR | GVSP_PIX_OCCUPY48BIT	| 0x0024)

